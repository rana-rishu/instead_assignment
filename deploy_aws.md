# AWS Deployment Guide for Instead Tax Annotation Studio

## Option 1: Deploy to AWS S3 + CloudFront (Recommended - Fastest & Serverless)

### Step 1: Create an S3 Bucket
1. Open AWS Management Console -> **S3**.
2. Click **Create bucket** (e.g., `instead-tax-annotator`).
3. Under **Block Public Access settings**, uncheck "Block all public access" (or use CloudFront Origin Access Control OAC).
4. In Bucket **Properties**, scroll to **Static website hosting** -> Click **Edit** -> **Enable** -> set Index document to `index.html` and Error document to `index.html`.

### Step 2: Upload the `dist/` Folder
Using AWS CLI:
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```
Or manually upload all files from the `dist/` folder directly in the S3 Web Console.

### Step 3: Add Bucket Policy for Public Read (if direct S3 hosting)
In S3 Bucket -> **Permissions** -> **Bucket policy**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

---

## Option 2: Deploy to AWS Amplify (Easiest 1-Click Hosting)

1. Go to AWS Console -> **AWS Amplify**.
2. Click **Deploy an app** -> **Host web app without Git provider** (or connect GitHub).
3. Drag & drop the `dist/` folder.
4. AWS Amplify will generate a live HTTPS URL in 30 seconds.

---

## Option 3: Deploy on AWS EC2 (Nginx / Node)

If hosting on an Ubuntu EC2 instance:
```bash
# 1. Install Nginx
sudo apt update && sudo apt install -y nginx

# 2. Copy dist folder to web root
sudo cp -r dist/* /var/www/html/

# 3. Restart Nginx
sudo systemctl restart nginx
```
