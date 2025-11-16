import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import productData from "../../../assets/data/ProductData";
import { Link } from "react-router-dom";

export default function CategoryManager() {
  const [categories, setCategories] = useState(productData.categories);
  const [newName, setNewName] = useState("");
  const [parentId, setParentId] = useState(null);

  // Xây dựng cây phân cấp từ danh sách
  const buildTree = (parentId = null) => {
    return categories
      .filter((c) => c.parent_id === parentId)
      .map((c) => ({
        ...c,
        children: buildTree(c.id),
      }));
  };

  const categoryTree = buildTree();

  // Thêm danh mục mới
  const handleAddCategory = () => {
    if (!newName.trim()) return;
    const newCategory = {
      id: Date.now(),
      name: newName,
      parent_id: parentId ? Number(parentId) : null,
    };
    setCategories([...categories, newCategory]);
    setNewName("");
    setParentId(null);
  };

  // Xóa danh mục
  const handleDelete = (id) => {
    setCategories(categories.filter((c) => c.id !== id && c.parent_id !== id));
  };

  // Hiển thị phân cấp trong bảng
  const renderRows = (tree, level = 0) => {
    return tree.map((cat) => (
      <React.Fragment key={cat.id}>
        <tr>
          <td>{cat.id}</td>
          <td>
            <div style={{ marginLeft: `${level * 25}px` }}>
              {level > 0 && "└── "} {cat.name}
            </div>
          </td>
          <td>{cat.parent_id || "—"}</td>
          <td>
            <button
              className="btn btn-outline-danger btn-sm me-2"
              onClick={() => handleDelete(cat.id)}
            >
              Xóa
            </button>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setParentId(cat.id)}
            >
              + Thêm con
            </button>
          </td>
        </tr>
        {renderRows(cat.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Quản lý danh mục</h3>
        <Link to="/seller/products" className="btn btn-light btn-sm fw-medium border">
          ← Quay lại
        </Link>
      </div>
      {/* Form thêm danh mục */}
      <div className="card p-3 mb-4 border">
        <div className="row g-2 align-items-center">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Tên danh mục mới..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={parentId || ""}
              onChange={(e) => setParentId(e.target.value || null)}
            >
              <option value="">Không có cha (cấp 1)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <button
              className="btn btn-outline-success w-100"
              onClick={handleAddCategory}
            >
              Thêm danh mục
            </button>
          </div>
        </div>
      </div>

      {/* Bảng hiển thị danh mục */}
      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Parent ID</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>{renderRows(categoryTree)}</tbody>
      </table>
    </div>
  );
}
