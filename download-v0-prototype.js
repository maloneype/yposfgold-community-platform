#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// V0 URL from your provided token
const v0Url = 'https://v0.dev/chat/b/b_LhyeMWE2BaU?token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..lURkJtwSd2CSwA54.rcnJoAvQN2kf0pUdLRau99fOVxw1OtqIMryfAYY3Rcf_RMt4sJ0jMO8tjA8.S9WowweBZVKWUMc8Mtq-WQ';

// Output directory
const outputDir = path.join(__dirname, 'prototypes', 'v0');

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Downloading v0 prototype code...');
console.log(`Output directory: ${outputDir}`);

// Fetch the v0 code
https.get(v0Url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      // Try to extract code blocks from the response
      const codeBlocks = extractCodeBlocks(data);
      
      if (codeBlocks.length === 0) {
        console.log('No code blocks found in the response. Saving raw response...');
        fs.writeFileSync(path.join(outputDir, 'raw-response.txt'), data);
        return;
      }

      // Save each code block to a separate file
      codeBlocks.forEach((block, index) => {
        const { filename, content } = block;
        const filePath = path.join(outputDir, filename || `code-block-${index}.txt`);
        
        // Create subdirectories if needed
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`Saved: ${filePath}`);
      });

      // Also save the full response for reference
      fs.writeFileSync(path.join(outputDir, 'full-response.txt'), data);
      console.log('Download complete!');
      
    } catch (error) {
      console.error('Error processing the response:', error);
      fs.writeFileSync(path.join(outputDir, 'error-response.txt'), data);
    }
  });
}).on('error', (err) => {
  console.error('Error downloading the v0 prototype:', err.message);
});

// Function to extract code blocks from the response
function extractCodeBlocks(data) {
  const blocks = [];
  
  try {
    // Try to parse as JSON first
    const json = JSON.parse(data);
    if (json.files && Array.isArray(json.files)) {
      return json.files.map(file => ({
        filename: file.name,
        content: file.content
      }));
    }
  } catch (e) {
    // Not JSON, try to extract code blocks manually
  }
  
  // Look for markdown code blocks
  const codeBlockRegex = /```(?:(\w+)\n)?([\s\S]*?)```/g;
  let match;
  
  while ((match = codeBlockRegex.exec(data)) !== null) {
    const language = match[1] || '';
    const content = match[2];
    
    // Try to determine filename from content
    let filename = null;
    const filenameMatch = content.match(/^(?:\/\/|#)\s*(\S+\.[\w.]+)/);
    if (filenameMatch) {
      filename = filenameMatch[1];
    } else if (language) {
      // Use language as extension
      filename = `file-${blocks.length + 1}.${language}`;
    }
    
    blocks.push({
      filename: filename || `file-${blocks.length + 1}.txt`,
      content
    });
  }
  
  return blocks;
} 