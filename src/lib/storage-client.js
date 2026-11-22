/**
 * เชื่อมคำสั่งจัดเก็บไฟล์ของแอปเข้ากับบริการ S3
 * ใช้เพิ่ม อ่าน ตรวจสอบ และลบไฟล์ผ่านรูปแบบคำสั่งเดียวกับ MinIO
 */

// S3-compatible operations shared by the app and maintenance scripts.
// Existing MinIO buckets, keys, credentials and public URLs remain compatible.
const { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand,
  DeleteObjectCommand, HeadBucketCommand, CreateBucketCommand, PutBucketPolicyCommand } = require('@aws-sdk/client-s3');
const { del, get, head, put } = require('@vercel/blob');
const { Readable } = require('node:stream');

class Client {
  constructor({ endPoint, port, useSSL, accessKey, secretKey }) {
    this.useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN));
    this.s3 = new S3Client({
      endpoint: `${useSSL ? 'https' : 'http'}://${endPoint}:${port}`,
      region: process.env.MINIO_REGION || 'us-east-1', forcePathStyle: true,
      credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
    });
  }
  async putObject(bucket, key, body, length, metadata) {
    if (this.useBlob) {
      return put(key, body, {
        access: 'public',
        addRandomSuffix: false,
        contentType: metadata['Content-Type'],
      });
    }
    return this.s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentLength: length, ContentType: metadata['Content-Type'] }));
  }
  async statObject(bucket, key) {
    if (this.useBlob) {
      const result = await head(key);
      return { metaData: { 'content-type': result.contentType || 'application/octet-stream' } };
    }
    const result = await this.s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return { metaData: { 'content-type': result.ContentType || 'application/octet-stream' } };
  }
  async getObject(bucket, key) {
    if (this.useBlob) {
      const result = await get(key, { access: 'public' });
      if (!result || result.statusCode !== 200 || !result.stream) throw new Error('Blob not found');
      return Readable.fromWeb(result.stream);
    }
    const result = await this.s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    if (!result.Body) throw new Error('Empty object body');
    return result.Body;
  }
  async removeObject(bucket, key) {
    if (this.useBlob) return del(key);
    await this.s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  }
  async bucketExists(bucket) {
    try { await this.s3.send(new HeadBucketCommand({ Bucket: bucket })); return true; }
    catch (error) { if (error.$metadata?.httpStatusCode === 404) return false; throw error; }
  }
  async makeBucket(bucket) {
    await this.s3.send(new CreateBucketCommand({ Bucket: bucket }));
  }
  async setBucketPolicy(bucket, policy) {
    await this.s3.send(new PutBucketPolicyCommand({ Bucket: bucket, Policy: policy }));
  }
}
module.exports = { Client };
