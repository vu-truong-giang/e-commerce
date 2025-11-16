import React, { useState, useEffect } from "react";
import productData from "../../assets/data/ProductData";

export default function ProductCategory({ id }) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryHierarchy, setCategoryHierarchy] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const productId = parseInt(id, 10);

  // Khi xem chi tiết sản phẩm
  useEffect(() => {
    if (id) {
      const productCategory = productData.product_categories.find(
        (pc) => pc.product_id === productId
      );

      if (productCategory) {
        let category = productData.categories.find(
          (c) => c.id === productCategory.category_id
        );
        setCategoryName(category ? category.name : "");

        const hierarchy = [];
        while (category) {
          hierarchy.unshift(category.name); // thêm vào đầu mảng
          category = productData.categories.find(
            (c) => c.id === category.parent_id
          );
        }
        setCategoryHierarchy(hierarchy);
      } else {
        setCategoryName("");
      }
    } else {
      setCategoryName("");
    }
  }, [id, productId]);

  // Lấy các category con của parentId
  const getChildren = (parentId) => {
    return productData.categories.filter((cat) => cat.parent_id === parentId);
  };

  // Khi chọn category ở cấp levelIndex
  const handleChange = (levelIndex, value) => {
    const newSelected = [...selectedCategories];
    newSelected[levelIndex] = parseInt(value, 10);
    newSelected.splice(levelIndex + 1); // Xóa các cấp sau
    setSelectedCategories(newSelected);

    // Cập nhật categoryName = tên của category cuối cùng được chọn
    const lastSelectedId = newSelected[newSelected.length - 1];
    const lastCategory = productData.categories.find(c => c.id === lastSelectedId);
    setCategoryName(lastCategory ? lastCategory.name : "");
  };

  // Sinh select đệ quy
  const renderSelects = (parentId = null, levelIndex = 0) => {
    const children = getChildren(parentId);
    if (children.length === 0) return null;

    return (
      <div key={levelIndex} className="mb-2">
        <select
          className="form-select mb-2"
          value={selectedCategories[levelIndex] || ""}
          onChange={(e) => handleChange(levelIndex, e.target.value)}
        >
          <option value="">-- Chọn danh mục --</option>
          {children.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Nếu đã chọn 1 con, đệ quy cho cấp tiếp theo */}
        {selectedCategories[levelIndex] &&
          renderSelects(selectedCategories[levelIndex], levelIndex + 1)}
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm mb-3">
      <label className="form-label fw-semibold">Danh mục</label>

      {id ? (
        // Hiển thị hierarchy khi có id
        categoryHierarchy.map((ch, idx) => (
          <input
            key={idx}
            type="text"
            className="form-control mb-2"
            placeholder="Danh mục..."
            value={ch}
            readOnly
          />
        ))
      ) : (
        // Khi tạo mới sản phẩm → hiển thị select đệ quy
        renderSelects()
      )}
    </div>
  );
}
