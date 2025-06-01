import React, { useState } from 'react';
import './RegisterProperty.css';

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

  const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();
  const userEmail = localStorage.getItem('userEmail'); 
  data.append('email', userEmail);
  data.append('name', formData.name);
  data.append('contact', formData.contact);
  data.append('email', formData.email);
  data.append('address', formData.address);
  data.append('area', formData.area);
  data.append('yearBuilt', formData.yearBuilt);
  data.append('floors', formData.floors);
  data.append('usage', formData.usage);
  data.append('touristSpots', formData.touristSpots);
  formData.images.forEach((img, i) => data.append('files', img));

  try {
    const response = await fetch('http://localhost:8000/upload_images', {
      method: 'POST',
      body: data,
    });
    const result = await response.json();
    console.log('서버 응답:', result);
    alert('매물 등록이 완료되었습니다! 결과: ' + (result.result_path || '없음'));
  } catch (error) {
    alert('등록 중 오류 발생: ' + error.message);
  }
};

  return (
    <div className="register-container">
      <h1>매도 의뢰</h1>
      <form onSubmit={handleSubmit}>
        {/* 의뢰인 정보 */}
        <fieldset className="form-section">
          <legend><strong>의뢰인 정보</strong></legend>

          <div className="form-row">
            <label htmlFor="name">성함</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label htmlFor="contact">연락처</label>
            <input type="text" id="contact" name="contact" value={formData.contact} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label htmlFor="email">이메일</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
        </fieldset>

        {/* 매도 정보 */}
        <fieldset className="form-section">
          <legend><strong>매도 정보</strong></legend>

          <div className="form-row">
            <label htmlFor="address">주소</label>
            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label htmlFor="area">면적</label>
            <input type="text" id="area" name="area" value={formData.area} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label htmlFor="yearBuilt">준공년도</label>
            <input type="text" id="yearBuilt" name="yearBuilt" value={formData.yearBuilt} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label htmlFor="floors">층수</label>
            <input type="text" id="floors" name="floors" value={formData.floors} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label htmlFor="usage">용도</label>
            <input type="text" id="usage" name="usage" value={formData.usage} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label htmlFor="touristSpots">주변 관광지</label>
            <input type="text" id="touristSpots" name="touristSpots" value={formData.touristSpots} onChange={handleChange} />
          </div>
        </fieldset>

        {/* 이미지 업로드 */}
        <fieldset className="form-section">
          <legend><strong>대표 사진 업로드</strong></legend>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} /><br /><br />
          <div className="image-preview-box">
            {formData.images.map((image, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(image)}
                alt={`preview-${idx}`}
                className="image-preview"
              />
            ))}
          </div>
        </fieldset>

        <button type="submit" className="submit-button">등록하기</button>
      </form>
    </div>
  );
}

export default RegisterProperty;
