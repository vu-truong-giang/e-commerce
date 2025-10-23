type ProductItemProps = {
  number: number;
  name: string;
  quantity: number;
  price: number;
  totalItem: number;
};

export default function ProductItem({ number, name, quantity, price, totalItem }: ProductItemProps) {
  return (
    <tr>
      <td>{number}</td>
      <td>{name}</td>
      <td>{quantity}</td>
      <td>{price.toLocaleString('vi-VN')}₫</td>
      <td>{totalItem.toLocaleString('vi-VN')}₫</td>
    </tr>
  );
}
