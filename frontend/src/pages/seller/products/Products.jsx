import { Link , useParams} from "react-router-dom";
import { productData } from "../../../assets/data/ProductData";
import  ProductItem  from "../../../components/products/ProductItem";

const products = productData.products;

export default function Products() {
  
  const {sellerid} =  useParams();
  
  return (
    <div className="container py-4">
      {/* --- Header --- */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Quản lý sản phẩm</h3>
        <div className="d-flex gap-1">
          <Link to={`/seller/${sellerid}/products/category`}
          className="btn btn-outline-primary rounded-pill px-4"
          
        >
          + Bảng danh mục sản phẩm 
        </Link>
        <Link to={`/seller/${sellerid}/products/new`}
          className="btn btn-primary rounded-pill px-4"
          
        >
          + Thêm sản phẩm mới
        </Link>
        </div>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="filter-bar bg-white rounded-3 shadow-sm p-3 mb-4">
        <form className="row g-3 align-items-center">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm mã đơn hàng..."
            />
          </div>
          <div className="col-md-3">
            <select className="form-select">
              <option>Trạng thái đơn hàng</option>
              <option>Chờ xác nhận</option>
              <option>Đang giao</option>
              <option>Hoàn tất</option>
              <option>Đã hủy</option>
            </select>
          </div>
          <div className="col-md-3">
            <input type="date" className="form-control" />
          </div>
          <div className="col-md-2">
            <select className="form-select">
              <option>Phương thức thanh toán</option>
              <option>COD</option>
              <option>Chuyển khoản</option>
            </select>
          </div>
          <div className="col-md-1">
            <button type="button" className="btn btn-primary w-100">
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* --- Bảng sản phẩm --- */}
      <div className="table-responsive shadow-sm rounded-3">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th scope="col" style={{ width: "5%" }}>
                #
              </th>
              <th scope="col" style={{ width: "10%" }}>
                Ảnh
              </th>
              <th scope="col">Tên sản phẩm</th>
              <th scope="col">Danh mục</th>
              <th scope="col">Giá</th>
              <th scope="col">Tồn kho</th>
              <th scope="col" className="text-center" style={{ width: "15%" }}>
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <ProductItem key={p.id} number={index+1} id={p.id} name={p.name} category={p.category} image={p.images[0]}/>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
