import os
import zipfile
import json
import xml.etree.ElementTree as ET

namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

def safe_print(msg):
    try:
        print(msg)
    except UnicodeEncodeError:
        print(msg.encode('ascii', 'backslashreplace').decode())

def extract_paragraphs(docx_path, out_js_path):
    try:
        safe_print(f"Extracting: {docx_path} -> {out_js_path}")
        with zipfile.ZipFile(docx_path) as z:
            xml_content = z.read('word/document.xml')
            root = ET.fromstring(xml_content)
            
            # Find all paragraphs and get InnerText
            texts = []
            for p in root.findall('.//w:p', namespaces):
                # Join all text elements in the paragraph
                p_text = "".join(t.text for t in p.findall('.//w:t', namespaces) if t.text)
                texts.append(p_text)
                
            # Construct variable name based on filename
            base = os.path.basename(out_js_path)
            templates = ["buu_cuc.js", "ktc.js", "tai.js", "khach_hang.js", "finetoday.js", "non_ecom.js"]
            if base == "plain_text.js" or base not in templates:
                var_name = "CONTRACT_TEXT"
            else:
                key_name = base.replace(".js", "")
                var_name = f"TEMPLATE_TEXT_{key_name}"
                
            text_content = "\n".join(texts)
            js_content = f"window.{var_name} = {json.dumps(text_content, ensure_ascii=False)};"
            
            # Write to JS file
            with open(out_js_path, 'w', encoding='utf-8') as f:
                f.write(js_content)
            safe_print(f"  Successfully extracted {len(texts)} paragraphs ({os.path.getsize(out_js_path)} bytes).")
    except Exception as e:
        safe_print(f"  Error extracting {docx_path}: {e}")

def main():
    temp_dir = 'temp'
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
        
    import re
    # 1. Extract active contracts
    # We find all docx files in the root directory
    candidates = [f for f in os.listdir('.') if f.endswith('.docx') and 'temp' not in f and 'webapp' not in f]
    if candidates:
        for contract_file in candidates:
            # Also write plain_text.js for the first candidate as default
            if contract_file == candidates[0]:
                extract_paragraphs(contract_file, os.path.join(temp_dir, 'plain_text.js'))
            
            # Write original named JS file
            js_name = os.path.splitext(contract_file)[0] + ".js"
            extract_paragraphs(contract_file, os.path.join(temp_dir, js_name))
            
            # Write clean named JS file (strip UUID and duplicate suffix)
            base = os.path.splitext(contract_file)[0]
            uuid_pattern = r'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}_'
            clean_base = re.sub(uuid_pattern, '', base)
            clean_base = re.sub(r'\s*\(\d+\)$', '', clean_base)
            clean_js_name = clean_base + ".js"
            if clean_js_name != js_name:
                extract_paragraphs(contract_file, os.path.join(temp_dir, clean_js_name))
    else:
        safe_print("No active contract docx found in root.")

    # 2. Extract templates
    standard_templates_dir = 'webapp/standard_templates'
    if os.path.exists(standard_templates_dir):
        # We will loop through the subfolders of standard_templates
        for item in os.listdir(standard_templates_dir):
            item_path = os.path.join(standard_templates_dir, item)
            if not os.path.isdir(item_path):
                continue
            
            dir_name_lower = item.lower()
            safe_print(f"Processing standard templates folder: {item}")
            
            # Group 1: Hợp đồng khách hàng
            if 'khách hàng' in dir_name_lower or 'khach hang' in dir_name_lower:
                for root_dir, _, files in os.walk(item_path):
                    for file in files:
                        if not file.endswith('.docx'):
                            continue
                        full_path = os.path.join(root_dir, file)
                        full_path_lower = full_path.lower()
                        file_lower = file.lower()
                        
                        key = None
                        if 'b2b' in file_lower:
                            key = 'finetoday'
                        elif 'non-ecom' in file_lower or 'non_ecom' in file_lower or 'nonecom' in file_lower:
                            key = 'non_ecom'
                        elif 'sme' in full_path_lower and '03' in file_lower:
                            key = 'khach_hang'
                        
                        if key:
                            extract_paragraphs(full_path, os.path.join(temp_dir, f"{key}.js"))
            
            # Group 2: Hợp đồng thuê KTC KCT
            elif 'ktc' in dir_name_lower or 'kct' in dir_name_lower:
                candidate_files = []
                for root_dir, _, files in os.walk(item_path):
                    for file in files:
                        if file.endswith('.docx'):
                            candidate_files.append(os.path.join(root_dir, file))
                
                # Pick file with "có cọc" or the first one
                selected_file = None
                for f in candidate_files:
                    f_name = os.path.basename(f).lower()
                    if 'có cọc' in f_name or 'co c' in f_name or 'c_c' in f_name:
                        selected_file = f
                        break
                if not selected_file and candidate_files:
                    selected_file = candidate_files[0]
                
                if selected_file:
                    extract_paragraphs(selected_file, os.path.join(temp_dir, 'ktc.js'))
            
            # Group 3: Hợp đồng thuê kho bưu cục
            elif 'kho' in dir_name_lower:
                candidate_files = []
                for root_dir, _, files in os.walk(item_path):
                    for file in files:
                        if file.endswith('.docx'):
                            candidate_files.append(os.path.join(root_dir, file))
                
                # Pick file with "có cọc" or the first one
                selected_file = None
                for f in candidate_files:
                    f_name = os.path.basename(f).lower()
                    if 'có cọc' in f_name or 'co c' in f_name or '20241105' in f_name:
                        selected_file = f
                        break
                if not selected_file and candidate_files:
                    selected_file = candidate_files[0]
                
                if selected_file:
                    extract_paragraphs(selected_file, os.path.join(temp_dir, 'buu_cuc.js'))
            
            # Group 4: Hợp đồng thuê tải
            elif 'tải' in dir_name_lower or 'tai' in dir_name_lower:
                selected_file = None
                for root_dir, _, files in os.walk(item_path):
                    for file in files:
                        if file.endswith('.docx'):
                            selected_file = os.path.join(root_dir, file)
                            break
                    if selected_file:
                        break
                
                if selected_file:
                    extract_paragraphs(selected_file, os.path.join(temp_dir, 'tai.js'))

if __name__ == '__main__':
    main()
