// src/components/ImageOrUrlInput.jsx
import React, { useState } from 'react';
import { useInput } from 'react-admin';

const ImageOrUrlInput = ({ source, label }) => {
    const {
        field,
        fieldState: { error },
    } = useInput({ source });
    const [type, setType] = useState(field.value && typeof field.value === "string" ? "url" : "file");
    const [preview, setPreview] = useState(field.value && typeof field.value === 'string' ? field.value : '');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            field.onChange({ rawFile: file });
            setPreview(URL.createObjectURL(file));
        }
    };
    const handleUrlChange = (e) => {
        field.onChange(e.target.value);
        setPreview(e.target.value);
    };

    return (
        <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 500 }}>{label}</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                    type="button"
                    onClick={() => setType("file")}
                    style={{
                        background: type === 'file' ? '#222' : '#eee',
                        color: type === 'file' ? '#fff' : '#333',
                        border: '1px solid #aaa',
                        borderRadius: 4,
                        padding: '2px 8px'
                    }}
                >File</button>
                <button
                    type="button"
                    onClick={() => setType("url")}
                    style={{
                        background: type === 'url' ? '#222' : '#eee',
                        color: type === 'url' ? '#fff' : '#333',
                        border: '1px solid #aaa',
                        borderRadius: 4,
                        padding: '2px 8px'
                    }}
                >Link</button>
            </div>
            {type === "file" && (
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: 8 }} />
            )}
            {type === "url" && (
                <input
                    type="text"
                    value={typeof field.value === 'string' ? field.value : ''}
                    onChange={handleUrlChange}
                    placeholder="Dán link ảnh..."
                    style={{ marginTop: 8, width: '100%' }}
                />
            )}
            {preview && (
                <div style={{ marginTop: 8 }}>
                    <img src={preview} alt="preview" style={{ maxWidth: 200, maxHeight: 100, border: '1px solid #ccc', borderRadius: 8 }} />
                </div>
            )}
            {error && <span style={{ color: "red" }}>{error.message}</span>}
        </div>
    );
};
export default ImageOrUrlInput;
