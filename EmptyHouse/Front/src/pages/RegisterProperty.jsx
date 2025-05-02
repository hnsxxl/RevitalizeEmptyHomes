import React, { useState } from 'react';

function RegisterProperty() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    address: '',
    area: '',
    yearBuilt: '',
    floors: '',
    usage: '',
    touristSpots: '',
    images: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('제출된 데이터:', formData);
    alert('매물 등록이 완료되었습니다!');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>매도 의뢰</h1>
      <form onSubmit={handleSubmit}>
        {/* 의뢰인 정보 구역 */}
        <fieldset style={{ marginBottom: '20px' }}>
          <legend><strong>의뢰인 정보</strong></legend>
          <label>
            성함: <input type="text" name="name" value={formData.name} onChange={handleChange} required /><br /><br />
          </label>
          <label>
            연락처: <input type="text" name="contact" value={formData.contact} onChange={handleChange} required /><br /><br />
          </label>
          <label>
            이메일: <input type="email" name="email" value={formData.email} onChange={handleChange} required /><br /><br />
          </label>
        </fieldset>

        {/* 매도 정보 구역 */}
        <fieldset style={{ marginBottom: '20px' }}>
          <legend><strong>매도 정보</strong></legend>
          <label>
            주소: <input type="text" name="address" value={formData.address} onChange={handleChange} required /><br /><br />
          </label>
          <label>
            면적: <input type="text" name="area" value={formData.area} onChange={handleChange} required /><br /><br />
          </label>
          <label>
            준공년도: <input type="text" name="yearBuilt" value={formData.yearBuilt} onChange={handleChange} required /><br /><br />
          </label>
          <label>
            층수: <input type="text" name="floors" value={formData.floors} onChange={handleChange} required /><br /><br />
          </label>
          <label>
            용도: <input type="text" name="usage" value={formData.usage} onChange={handleChange} required /><br /><br />
          </label>
          <label>
            주변 관광지: <input type="text" name="touristSpots" value={formData.touristSpots} onChange={handleChange} /><br /><br />
          </label>
        </fieldset>

        {/* 이미지 업로드 */}
        <fieldset style={{ marginBottom: '20px' }}>
          <legend><strong>대표 사진 업로드</strong></legend>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} /><br /><br />
          {/* 미리보기 */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {formData.images.map((image, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(image)}
                alt={`preview-${idx}`}
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
              />
            ))}
          </div>
        </fieldset>

        <button type="submit" style={{ padding: '15px', backgroundColor: '#4CAF50', color: 'white', fontSize: '1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' }}>
          등록하기
        </button>
      </form>
    </div>
  );
}

export default RegisterProperty;
