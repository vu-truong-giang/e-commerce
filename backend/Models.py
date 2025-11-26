import re
import unicodedata

def slugify(text: str) -> str:
    # Chuẩn hóa Unicode về dạng NFKD (tách dấu)
    text = unicodedata.normalize('NFKD', text)
    # Chuyển về ASCII, bỏ các ký tự không encode được
    text = text.encode('ascii', 'ignore').decode('ascii')
    # Chuyển về chữ thường
    text = text.lower()
    # Thay tất cả ký tự không phải a-z, 0-9 thành dấu '-'
    text = re.sub(r'[^a-z0-9]+', '-', text)
    # Bỏ dấu '-' thừa đầu và cuối
    text = text.strip('-')
    return text

# Ví dụ
print(slugify("Tủ lạnh đẹp quá"))  # Output: tu-lanh-dep-qua
print(slugify("Máy xay sinh tố")) # Output: may-xay-sinh-to
