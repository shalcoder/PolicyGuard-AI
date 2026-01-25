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

    async def chunk_policy(self, text: str, chunk_size: int = 1500) -> List[str]:
        """
        Semantic chunking: Split by paragraphs/headers first, then merge or split to fit window.
        """
        # 1. Split by double newlines (paragraphs)
        paragraphs = re.split(r'\n\s*\n', text)
        
        chunks = []
        current_chunk = ""
        
        for p in paragraphs:
            p = p.strip()
            if not p:
                continue
                
            # If adding this paragraph exceeds target size, save current chunk and start new
            if len(current_chunk) + len(p) > chunk_size and current_chunk:
                chunks.append(current_chunk)
                current_chunk = p
            else:
                if current_chunk:
                    current_chunk += "\n\n" + p
                else:
                    current_chunk = p
        
        if current_chunk:
            chunks.append(current_chunk)
            
        return chunks
