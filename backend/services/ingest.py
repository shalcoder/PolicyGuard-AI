import re
from typing import List
# Placeholder for PDF/Docx parsers - we'll implement raw text for MVP first or basic helpers
# import pdfplumber 

class PolicyIngestor:
    def __init__(self):
        pass

    async def ingest_text(self, filename: str, content: str) -> str:
        """
        Clean and normalize text content.
        """
        # Basic cleaning
        cleaned = re.sub(r'\s+', ' ', content).strip()
        return cleaned

    async def chunk_policy(self, text: str, chunk_size: int = 1000) -> List[str]:
        """
        Semantic chunking (Rule-based for MVP, later LLM-based)
        """
        # Naive splitting by paragraphs or size
        # Better: split by headers "1.1", "Article 5", etc.
        chunks = []
        for i in range(0, len(text), chunk_size):
            chunks.append(text[i:i + chunk_size])
        return chunks
