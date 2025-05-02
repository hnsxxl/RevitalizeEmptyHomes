import React, { createContext, useContext, useState } from 'react';

const PropertyContext = createContext();

export function PropertyProvider({ children }) {
  const [properties] = useState([
    {
      id: 1,
      title: "익산시 빈집",
      region: "전라북도",
      tags: ["주거용", "리모델링 가능"],
      image: "/default-house.png",
      문의전화: "063-270-1111"
    },
    {
      id: 2,
      title: "해남군 빈집",
      region: "전라남도",
      tags: ["전원주택", "자연속", "주거용"],
      image: "/default-house.png",
      문의전화: "061-270-2222"
    },
    {
      id: 3,
      title: "제주시 상가건물",
      region: "제주특별자치도",
      tags: ["상업용", "관광지 근처"],
      image: "/default-house.png",
      문의전화: "064-270-3333"
    },
    {
      id: 4,
      title: "군산시 주택",
      region: "전라북도",
      tags: ["주거용", "교통 편리"],
      image: "/default-house.png",
      문의전화: "063-270-4444"
    },
    {
      id: 5,
      title: "천안시 상가",
      region: "충청남도",
      tags: ["상업용", "도심 근처"],
      image: "/default-house.png",
      문의전화: "041-270-5555"
    }
  ]);

  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (propertyId) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  return (
    <PropertyContext.Provider value={{ properties, favorites, toggleFavorite }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  return useContext(PropertyContext);
}
