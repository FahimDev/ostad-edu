const buildProductDescriptionPrompt = (product) => {
  return `
You are an e-commerce copywriter.

Generate a short product description.

Rules:
- Maximum 55 words.
- Simple and customer-friendly.
- Do not make unsupported claims.
- Do not mention fake certifications.
- Return only valid JSON.
- JSON format:
{
  "description": "string"
}

Product Information:
Name: ${product.name}
Brand: ${product.brand}
Category: ${product.category}
Price: ${product.price}
Discount Price: ${product.discountPrice || 0}
Remark: ${product.remark}
Specs: ${JSON.stringify(product.specs || {})}
`;
};

module.exports = {
  buildProductDescriptionPrompt,
};