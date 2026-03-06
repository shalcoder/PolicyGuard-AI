import re
from typing import List
import io

# Try-import to prevent crash if optional deps are missing
try:
    from unstructured.partition.auto import partition
    from unstructured.staging.base import convert_to_text
    HAS_UNSTRUCTURED = True
except ImportError:
    HAS_UNSTRUCTURED = False

try:
    import pypdf
    HAS_PYPDF = True
except ImportError:
    HAS_PYPDF = False

try:
    import docx
    HAS_DOCX = True
except ImportError:
    HAS_DOCX = False

class PolicyIngestor:
    def __init__(self):
        if HAS_UNSTRUCTURED:
            print("[INGEST] Using Unstructured.io for smart document parsing.")
        else:
            print("[INGEST] Unstructured.io not installed. Using basic pypdf/docx extraction.")

    def extract_text(self, file_content: bytes, filename: str) -> str:
        """
        Extract text based on file extension.
        Primary: unstructured library (preserves tables, titles, hierarchy).
        Fallback: pypdf for PDF, python-docx for DOCX.
        """
        ext = filename.lower().split('.')[-1]

        # --- Primary: Unstructured.io ---
        if HAS_UNSTRUCTURED and ext in ['pdf', 'docx', 'doc', 'html', 'htm', 'txt', 'md']:
            try:
                elements = partition(file=io.BytesIO(file_content), content_type=self._mime(ext))
                # Convert elements to readable text, preserving structure
                parts = []
                for el in elements:
                    el_type = type(el).__name__
                    text = str(el).strip()
                    if not text:
                        continue
                    if el_type == "Title":
                        parts.append(f"\n## {text}\n")
                    elif el_type == "Table":
                        parts.append(f"\n[TABLE]\n{text}\n[/TABLE]\n")
                    elif el_type == "ListItem":
                        parts.append(f"• {text}")
                    else:
                        parts.append(text)
                return "\n".join(parts)
            except Exception as e:
                print(f"[INGEST] Unstructured failed ({e}), falling back to basic parser.")

        # --- Fallback: pypdf for PDF ---
        if ext == 'pdf':
            if not HAS_PYPDF:
                raise ValueError("PDF support not installed. Run 'pip install pypdf'")
            try:
                reader = pypdf.PdfReader(io.BytesIO(file_content))
                text = ""
                for page in reader.pages:
                    text += page.extract_text() + "\n"
                return text
            except Exception as e:
                raise ValueError(f"Failed to parse PDF: {e}")

        # --- Fallback: python-docx for DOCX ---
        elif ext in ['docx', 'doc']:
            if not HAS_DOCX:
                raise ValueError("DOCX support not installed. Run 'pip install python-docx'")
            try:
                doc = docx.Document(io.BytesIO(file_content))
                text = "\n".join([p.text for p in doc.paragraphs])
                return text
            except Exception as e:
                raise ValueError(f"Failed to parse DOCX: {e}")
        
        else:
            # Default to text/markdown
            try:
                return file_content.decode('utf-8')
            except UnicodeDecodeError:
                return file_content.decode('latin-1')

    def _mime(self, ext: str) -> str:
        """Map extension to MIME type for unstructured."""
        return {
            "pdf": "application/pdf",
            "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "doc": "application/msword",
            "html": "text/html",
            "htm": "text/html",
            "txt": "text/plain",
            "md": "text/plain",
        }.get(ext, "text/plain")



    async def ingest_text(self, filename: str, content: str) -> str:
        """
        Clean and normalize text content.
        """
        # Basic cleaning
        cleaned = re.sub(r'\s+', ' ', content).strip()
        return cleaned

    def chunk_policy(self, text: str, chunk_size: int = 1500) -> List[str]:
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
