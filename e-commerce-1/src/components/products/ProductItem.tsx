import { Link } from "react-router-dom";
import { getPriceRangeByProductId, getStockByProductId , getCategoryByProductId } from "../../assets/data/FunctionData";

type ProductItemProps = {
  number: number;
  id: number;
  name: string;
  image: string;
};

export default function ProductItem({
  number,
  id,
  name,
  image,
}: ProductItemProps) {
  const priceRange = getPriceRangeByProductId(id);
  const stock = getStockByProductId(id);
  const category = getCategoryByProductId(id);

  const minPrice = priceRange ? priceRange.minPrice : 0;
  const maxPrice = priceRange ? priceRange.maxPrice : 0;

 
  return (
    <tr key={id}>
      <td>{number}</td>
      <td>
        <img
          src={image || "https://via.placeholder.com/60?text=No+Image"}
          alt={name}
          className="rounded"
          width="60"
          height="60"
          style={{ objectFit: "cover" }}
        />
      </td>
      <td>
        <strong>{name}</strong>
      </td>
      <td>{category}</td>
      <td className="text-danger fw-semibold">
        {minPrice === maxPrice
          ? `${minPrice.toLocaleString()} đ`
          : `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()} đ`}
      </td>
      <td>
        <span
          className={`badge ${
            stock > 0 ? "bg-success-subtle text-success" : "bg-danger"
          }`}
        >
          {stock > 0 ? `${stock} sp` : "Hết hàng"}
        </span>
      </td>
      <td className="text-center">
        <div className="d-flex justify-content-center gap-2">
          <Link
            to={`/seller/products/productDetail/${id}`}
            className="btn btn-sm btn-outline-primary"
          >
            Xem chi tiết
          </Link>
          <button className="btn btn-sm btn-outline-danger">Xóa</button>
        </div>
      </td>
    </tr>
  );
}
