import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Audio bucket name
const AUDIO_BUCKET = "make-b5eacdbd-audio";
// Image bucket name
const IMAGE_BUCKET = "make-b5eacdbd-images";

// Initialize storage bucket on startup
const initializeStorage = async () => {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error listing buckets:", listError);
      return;
    }

    // Initialize Audio Bucket
    const audioBucketExists = buckets?.some(bucket => bucket.name === AUDIO_BUCKET);
    
    if (!audioBucketExists) {
      console.log(`Creating audio bucket: ${AUDIO_BUCKET}`);
      const { error: createError } = await supabase.storage.createBucket(AUDIO_BUCKET, {
        public: false,
        fileSizeLimit: 52428800, // 50MB limit
        allowedMimeTypes: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"],
      });
      
      if (createError) {
        console.error("Error creating audio bucket:", createError);
      } else {
        console.log(`Successfully created audio bucket: ${AUDIO_BUCKET}`);
      }
    } else {
      console.log(`Audio bucket already exists: ${AUDIO_BUCKET}`);
    }

    // Initialize Image Bucket
    const imageBucketExists = buckets?.some(bucket => bucket.name === IMAGE_BUCKET);
    
    if (!imageBucketExists) {
      console.log(`Creating image bucket: ${IMAGE_BUCKET}`);
      const { error: createError } = await supabase.storage.createBucket(IMAGE_BUCKET, {
        public: false,
        fileSizeLimit: 10485760, // 10MB limit
        allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"],
      });
      
      if (createError) {
        console.error("Error creating image bucket:", createError);
      } else {
        console.log(`Successfully created image bucket: ${IMAGE_BUCKET}`);
      }
    } else {
      console.log(`Image bucket already exists: ${IMAGE_BUCKET}`);
    }

  } catch (error) {
    console.error("Error initializing storage:", error);
  }
};

// Initialize storage on startup
initializeStorage();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-b5eacdbd/health", (c) => {
  return c.json({ status: "ok" });
});

// Email subscription endpoint
app.post("/make-server-b5eacdbd/subscribe", async (c) => {
  try {
    const body = await c.req.json();
    const { email, name, message } = body;

    if (!email || !email.includes("@")) {
      return c.json({ error: "Valid email is required" }, 400);
    }

    // Create unique key with timestamp
    const timestamp = Date.now();
    const key = `contact_${timestamp}_${email.replace(/[^a-zA-Z0-9]/g, "_")}`;

    // Store contact data
    await kv.set(key, {
      email,
      name: name || "",
      message: message || "",
      timestamp,
      submittedAt: new Date().toISOString(),
      status: "new",
    });

    console.log(`New contact submission: ${email} at ${new Date().toISOString()}`);

    return c.json({
      success: true,
      message: "Successfully subscribed to the contact list",
    });
  } catch (error) {
    console.error("Error processing subscription:", error);
    return c.json({ error: "Failed to process subscription" }, 500);
  }
});

// Get all contacts (for admin use - should be protected in production)
app.get("/make-server-b5eacdbd/contacts", async (c) => {
  try {
    const contacts = await kv.getByPrefix("contact_");
    return c.json({
      success: true,
      count: contacts.length,
      contacts: contacts.map(contact => ({
        email: contact.email,
        name: contact.name,
        message: contact.message,
        submittedAt: contact.submittedAt,
        status: contact.status,
      })),
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return c.json({ error: "Failed to fetch contacts" }, 500);
  }
});

// Upload audio file
app.post("/make-server-b5eacdbd/audio/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Validate file type
    if (!file.type.startsWith("audio/")) {
      return c.json({ error: "File must be an audio file" }, 400);
    }

    // Validate file size (50MB limit for Supabase Storage free tier)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      return c.json({ 
        error: `File size exceeds maximum allowed size of 50MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.` 
      }, 413);
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(AUDIO_BUCKET)
      .upload(fileName || file.name, uint8Array, {
        contentType: file.type,
        upsert: true, // Overwrite if exists
      });

    if (error) {
      console.error("Upload error:", error);
      // Handle specific storage errors
      if (error.message.includes("exceeded") || error.message.includes("413")) {
        return c.json({ error: "File size exceeds storage limits. Please use a file smaller than 50MB." }, 413);
      }
      return c.json({ error: `Upload failed: ${error.message}` }, 500);
    }

    console.log(`Successfully uploaded audio file: ${fileName || file.name}`);

    return c.json({
      success: true,
      path: data.path,
      message: "Audio file uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading audio:", error);
    return c.json({ error: `Failed to upload audio: ${error}` }, 500);
  }
});

// Get signed URL for audio file
app.get("/make-server-b5eacdbd/audio/:fileName", async (c) => {
  try {
    const fileName = c.req.param("fileName");

    if (!fileName) {
      return c.json({ error: "File name is required" }, 400);
    }

    // First check if file exists
    const { data: fileList, error: listError } = await supabase.storage
      .from(AUDIO_BUCKET)
      .list("", { search: fileName });

    if (listError) {
      console.error(`Error checking if ${fileName} exists:`, listError);
    }

    const fileExists = fileList && fileList.length > 0;

    if (!fileExists) {
      console.log(`Audio file not found in storage: ${fileName}`);
      return c.json({ 
        success: false, 
        error: "File not found",
        message: `Upload ${fileName} via /admin/audio` 
      }, 404);
    }

    // Generate signed URL (valid for 1 hour)
    const { data, error } = await supabase.storage
      .from(AUDIO_BUCKET)
      .createSignedUrl(fileName, 3600);

    if (error) {
      console.error("Error creating signed URL:", error);
      return c.json({ error: `Failed to get audio URL: ${error.message}` }, 500);
    }

    return c.json({
      success: true,
      url: data.signedUrl,
    });
  } catch (error) {
    console.error("Error getting audio URL:", error);
    return c.json({ error: `Failed to get audio URL: ${error}` }, 500);
  }
});

// List all audio files
app.get("/make-server-b5eacdbd/audio", async (c) => {
  try {
    const { data, error } = await supabase.storage
      .from(AUDIO_BUCKET)
      .list();

    if (error) {
      console.error("Error listing audio files:", error);
      return c.json({ error: `Failed to list audio files: ${error.message}` }, 500);
    }

    return c.json({
      success: true,
      files: data.map(file => ({
        name: file.name,
        size: file.metadata?.size,
        createdAt: file.created_at,
      })),
    });
  } catch (error) {
    console.error("Error listing audio files:", error);
    return c.json({ error: `Failed to list audio files: ${error}` }, 500);
  }
});

// Delete audio file
app.delete("/make-server-b5eacdbd/audio/:fileName", async (c) => {
  try {
    const fileName = c.req.param("fileName");

    if (!fileName) {
      return c.json({ error: "File name is required" }, 400);
    }

    const { error } = await supabase.storage
      .from(AUDIO_BUCKET)
      .remove([fileName]);

    if (error) {
      console.error("Error deleting audio file:", error);
      return c.json({ error: `Failed to delete audio file: ${error.message}` }, 500);
    }

    console.log(`Successfully deleted audio file: ${fileName}`);

    return c.json({
      success: true,
      message: "Audio file deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting audio file:", error);
    return c.json({ error: `Failed to delete audio file: ${error}` }, 500);
  }
});

// ------------------------------------------------------------------
// IMAGE ROUTES
// ------------------------------------------------------------------

// Upload image file
app.post("/make-server-b5eacdbd/images/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return c.json({ error: "File must be an image file" }, 400);
    }

    // Validate file size (10MB limit for images)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      return c.json({ 
        error: `Image size exceeds maximum allowed size of 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.` 
      }, 413);
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(fileName || file.name, uint8Array, {
        contentType: file.type,
        upsert: true, // Overwrite if exists
      });

    if (error) {
      console.error("Upload error:", error);
      // Handle specific storage errors
      if (error.message.includes("exceeded") || error.message.includes("413")) {
        return c.json({ error: "Image size exceeds storage limits. Please use a file smaller than 10MB." }, 413);
      }
      return c.json({ error: `Upload failed: ${error.message}` }, 500);
    }

    console.log(`Successfully uploaded image file: ${fileName || file.name}`);

    return c.json({
      success: true,
      path: data.path,
      message: "Image file uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return c.json({ error: `Failed to upload image: ${error}` }, 500);
  }
});

// Get signed URL for image file
app.get("/make-server-b5eacdbd/images/:fileName", async (c) => {
  try {
    const fileName = c.req.param("fileName");

    if (!fileName) {
      return c.json({ error: "File name is required" }, 400);
    }

    // Generate signed URL (valid for 1 hour)
    const { data, error } = await supabase.storage
      .from(IMAGE_BUCKET)
      .createSignedUrl(fileName, 3600);

    if (error) {
      console.error("Error creating signed URL:", error);
      return c.json({ error: `Failed to get image URL: ${error.message}` }, 500);
    }

    return c.json({
      success: true,
      url: data.signedUrl,
    });
  } catch (error) {
    console.error("Error getting image URL:", error);
    return c.json({ error: `Failed to get image URL: ${error}` }, 500);
  }
});

// List all image files
app.get("/make-server-b5eacdbd/images", async (c) => {
  try {
    const { data, error } = await supabase.storage
      .from(IMAGE_BUCKET)
      .list();

    if (error) {
      console.error("Error listing image files:", error);
      return c.json({ error: `Failed to list image files: ${error.message}` }, 500);
    }

    return c.json({
      success: true,
      files: data.map(file => ({
        name: file.name,
        size: file.metadata?.size,
        createdAt: file.created_at,
      })),
    });
  } catch (error) {
    console.error("Error listing image files:", error);
    return c.json({ error: `Failed to list image files: ${error}` }, 500);
  }
});

// Delete image file
app.delete("/make-server-b5eacdbd/images/:fileName", async (c) => {
  try {
    const fileName = c.req.param("fileName");

    if (!fileName) {
      return c.json({ error: "File name is required" }, 400);
    }

    const { error } = await supabase.storage
      .from(IMAGE_BUCKET)
      .remove([fileName]);

    if (error) {
      console.error("Error deleting image file:", error);
      return c.json({ error: `Failed to delete image file: ${error.message}` }, 500);
    }

    console.log(`Successfully deleted image file: ${fileName}`);

    return c.json({
      success: true,
      message: "Image file deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image file:", error);
    return c.json({ error: `Failed to delete image file: ${error}` }, 500);
  }
});

Deno.serve(app.fetch);