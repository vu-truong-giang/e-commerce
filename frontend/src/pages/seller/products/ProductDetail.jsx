import {  useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ProductCategory from "../../../components/products/ProductCategory";
import { createProduct } from "../../../API/SellerAPI";
export default function ProductDetail() {
  const { sellerid , productid } = useParams();

  const [productInfo, setProductInfo] = useState({
    name: "",
    description: "",
    seller_id: parseInt(sellerid) || null,
    options: [{ name: "", values: [""] }],
    variants: [{option_combination : {} , price : 0 , stock : 0 , sku : ""}],
  });

  useEffect(() => {
    if (productid) {
      // TODO: Load product từ API
    } else {
      setProductInfo({
        name: "",
        description: "",
        seller_id: parseInt(sellerid) || null,
        options: [{ name: "", values: [""] }],
        variants: [{option_combination : {} , price : 0 , stock : 0 , sku : ""}],
      });
    }
  }, [productid, sellerid]);


  // 🧠 Cập nhật state variants khi productInfo thay đổi
useEffect(() => {
  if (productInfo?.variants) {
    // giữ nguyên productInfo, chỉ set lại variants nếu cần
    setProductInfo((prev) => ({ ...prev, variants: productInfo.variants }));
  }
}, [productInfo?.variants]);

// Hàm so sánh 2 object option_combination
const isSameCombo = (a, b) => {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => a[key] === b[key]);
};

// Hàm sinh tất cả tổ hợp từ options
const generateOptionCombos = (options) => {
  const validOptions = options?.filter(
    (opt) => opt.name.trim() && opt.values.some((v) => v.trim() !== "")
  );
  if (!validOptions || !validOptions.length) return [];

  // Kết hợp các options
  const combine = (arr) =>
    arr.reduce(
      (acc, opt) => {
        const res = [];
        acc.forEach((a) => {
          opt.values.forEach((val) => {
            res.push({ ...a, [opt.name]: val });
          });
        });
        return res;
      },
      [{}]
    );

  return combine(validOptions);
};

// Hàm merge với variants cũ, giữ giá trị cũ
const mergeVariants = (options, existingVariants) => {
  const combos = generateOptionCombos(options);

  return combos.map((comb) => {
    const existing = existingVariants?.find((v) =>
      isSameCombo(v.option_combination, comb)
    );
    return existing
      ? { ...existing, option_combination: comb } // giữ giá trị cũ
      : { option_combination: comb, price: 0, stock: 0, sku: "" }; // default
  });
};

// 🧠 Khi options thay đổi → sinh lại variant, giữ lại giá cũ
useEffect(() => {
  if (!productInfo?.options) return;

  const updatedVariants = mergeVariants(
    productInfo.options,
    productInfo.variants || []
  );

  setProductInfo((prev) => ({ ...prev, variants: updatedVariants }));
}, [productInfo?.options]); // chỉ chạy khi options thay đổi

  const handleOptionNameChange = (index, value) => {
    const newOptions = [...productInfo.options];
    newOptions[index].name = value;
    setProductInfo({ ...productInfo, options: newOptions });
  };

  const handleValueChange = (optIndex, valIndex, value) => {
    const newOptions = [...productInfo.options];
    newOptions[optIndex].values[valIndex] = value;
    setProductInfo({ ...productInfo, options: newOptions });
  };
  const handleVariantChange = (index, field, value) => {
  setProductInfo((prev) => {
    const updatedVariants = [...(prev.variants || [])]; // copy variants cũ
    if (!updatedVariants[index]) return prev; // tránh lỗi undefined
    updatedVariants[index] = { ...updatedVariants[index], [field]: value }; // cập nhật field

    return { ...prev, variants: updatedVariants }; // trả về toàn bộ object productInfo mới
  });
};


  const addOption = () => {
    setProductInfo({
      ...productInfo,
      options: [...productInfo.options, { name: "", values: [""] }],
    });
  };

  const removeOption = (index) => {
    const newOptions = productInfo.options.filter((_, i) => i !== index);
    setProductInfo({ ...productInfo, options: newOptions });
  };

  const addValue = (optIndex) => {
    const newOptions = [...productInfo.options];
    newOptions[optIndex].values.push("");
    setProductInfo({ ...productInfo, options: newOptions });
  };

  const removeValue = (optIndex, valIndex) => {
    const newOptions = [...productInfo.options];
    newOptions[optIndex].values.splice(valIndex, 1);
    setProductInfo({ ...productInfo, options: newOptions });
  };

  return (
    <div className="container-xl py-4" style={{ backgroundColor: "#f9fafb" }}>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb small text-muted">
          <li className="breadcrumb-item">
            <Link
              to="/seller/dashboard"
              className="text-decoration-none text-secondary"
            >
              Trang chủ
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link
              to="/seller/products"
              className="text-decoration-none text-secondary"
            >
              Sản phẩm
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Chi tiết{productid ? ` #${productid}` : ""}
          </li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-2">
        {/* Tiêu đề bên trái */}

        <h3 className="fw-semibold mb-0 me-3">
          {productid ? `Chi tiết sản phẩm - ID: ${productid}` : "Tạo sản phẩm mới"}
        </h3>

        {/* Nút lưu / cập nhật bên phải */}
        <Link
          to={`/seller/${sellerid}/products`}
          className="btn btn-light btn-sm fw-medium border"
        >
          ← Quay lại
        </Link>
      </div>

      <div className="row">
        {/* Cột trái */}
        <div className="col-lg-8">
          <div className="mb-4 bg-white p-4 rounded shadow-sm">
            <label className="form-label fw-semibold">Tiêu đề</label>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Nhập tiêu đề sản phẩm..."
              value={productInfo.name}
              onChange={(e) =>
                setProductInfo({ ...productInfo, name: e.target.value })
              }
            />
            <label className="form-label fw-semibold">Mô tả sản phẩm</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Nhập mô tả chi tiết..."
              value={productInfo.description}
              onChange={(e) =>
                setProductInfo({ ...productInfo, description: e.target.value })
              }
            ></textarea>
          </div>

          {/* Hình ảnh */}
          <div className="mb-4 bg-white p-4 rounded shadow-sm">
            <label className="form-label fw-semibold">Hình ảnh</label>
            <div
              className="d-grid"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: "12px",
              }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="image-item border rounded overflow-hidden"
                  style={{ aspectRatio: "1/1" }}
                >
                  <img
                    src={`https://via.placeholder.com/150x150?text=Ảnh+${i}`}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
              <div
                className="upload-box border border-2 border-dashed text-center text-secondary rounded"
                style={{ paddingTop: "35%", cursor: "pointer" }}
              >
                <i className="bi bi-upload fs-4"></i>
                <div>Upload</div>
              </div>
            </div>
          </div>

          {/* Cấu hình biến thể */}
          <div className="card shadow-sm p-4">
            <h5 className="fw-semibold mb-3">
              Cấu hình biến thể (Variant Settings)
            </h5>

            {productInfo.options.map((opt, optIndex) => (
              <div
                key={optIndex}
                className="option-box bg-white border rounded p-3 mb-3"
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <label className="form-label fw-semibold mb-1">
                      Option name
                    </label>
                    <input
                      type="text"
                      className="form-control option-name"
                      placeholder="VD: Màu sắc, Kích cỡ..."
                      value={opt.name}
                      onChange={(e) =>
                        handleOptionNameChange(optIndex, e.target.value)
                      }
                    />
                  </div>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeOption(optIndex)}
                  >
                    Xóa option
                  </button>
                </div>

                <div className="value-area">
                  <label className="form-label fw-semibold mb-2">
                    Option values
                  </label>
                  <div className="value-list mb-2">
                    {opt.values.map((val, valIndex) => (
                      <div key={valIndex} className="d-flex value-item mb-2">
                        <input
                          type="text"
                          className="form-control option-value"
                          placeholder="Nhập giá trị (VD: Đỏ)"
                          value={val}
                          onChange={(e) =>
                            handleValueChange(
                              optIndex,
                              valIndex,
                              e.target.value
                            )
                          }
                        />
                        <button
                          className="btn btn-outline-danger btn-sm ms-2"
                          onClick={() => removeValue(optIndex, valIndex)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => addValue(optIndex)}
                  >
                    + Thêm giá trị
                  </button>
                </div>
              </div>
            ))}

            <button
              className="btn btn-outline-success btn-sm mt-2"
              onClick={addOption}
            >
              + Thêm option
            </button>

            <hr className="my-4" />

            {/* Bảng biến thể */}

            <div id="variant-table-area">
              <h6 className="fw-semibold mb-3">Bảng biến thể</h6>
              <table className="table table-bordered table-sm">
                <thead className="table-light">
                  <tr>
                    <th>Biến thể</th>
                    <th>Giá (VNĐ)</th>
                    <th>Số lượng</th>
                    <th>SKU</th>
                  </tr>
                </thead>
                <tbody>
                  {productInfo.variants.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        Chưa có biến thể nào được tạo
                      </td>
                    </tr>
                  ) : (
                    productInfo.variants.map((variant, idx) => (
                      <tr key={idx}>
                        <td>
                          {Object.entries(variant.option_combination || {})
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(" | ")}
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm text-center"
                            value={variant.price || 0}
                            onChange={(e) =>
                              handleVariantChange(idx, "price", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm text-center"
                            value={variant.stock || 0}
                            onChange={(e) =>
                              handleVariantChange(idx, "stock", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm text-center"
                            value={variant.sku || `SKU${idx + 1}`}
                            onChange={(e) =>
                              handleVariantChange(idx, "sku", e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-end mt-4 gap-2">
              <button className="btn btn-secondary px-4">Hủy</button>
              <button className="btn btn-primary px-4">Lưu sản phẩm</button>
            </div>
          </div>
        </div>

        {/* Cột phải */}
        <div className="col-lg-4">
          <div className="bg-white p-4 rounded shadow-sm mb-3">
            <label className="form-label fw-semibold">Hiển thị</label>
            <div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="status"
                  id="public"
                  defaultChecked
                />
                <label className="form-check-label" htmlFor="public">
                  Công khai
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="status"
                  id="draft"
                />
                <label className="form-check-label" htmlFor="draft">
                  Nháp
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm mb-3">
            <label className="form-label fw-semibold">Vendor</label>
            <input
              type="text"
              className="form-control"
              placeholder="BLACK WHITE"
            />
          </div>
          <div className="bg-white p-4 rounded shadow-sm mb-3">
            <label className="form-label fw-semibold">Collections</label>
            <input
              type="text"
              className="form-control"
              placeholder="Phụ kiện nhà bếp, Tô - Chén - Dĩa"
            />
          </div>

          <ProductCategory id={productid} />

          <div className="bg-white p-4 rounded shadow-sm mb-3">
            <label className="form-label fw-semibold">Tags</label>
            <input
              type="text"
              className="form-control"
              placeholder="Tag1, Tag2..."
            />
          </div>
          {/* Nút lưu / cập nhật bên phải */}
          {productid ? (
            <div className="d-flex gap-2">
              <button className="btn btn-primary px-4 rounded shadow-sm">
                Cập nhật
              </button>
              <button className="btn btn-warning px-4 rounded shadow-sm">
                Xóa sản phẩm
              </button>
            </div>
          ) : (
            <button className="btn btn-primary px-4 rounded shadow-sm" onClick={async () => {
              const result = await createProduct(productInfo);
              if (result) {
                alert("✅ Tạo sản phẩm thành công!");
                // Reset form
                setProductInfo({
                  name: "",
                  description: "",
                  seller_id: parseInt(sellerid) || null,
                  options: [{ name: "", values: [""] }],
                  variants: [{option_combination : {} , price : 0 , stock : 0 , sku : ""}],
                });
              } else {
                alert("❌ Tạo sản phẩm thất bại. Vui lòng thử lại!");
              }
            }}>
              Lưu sản phẩm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
