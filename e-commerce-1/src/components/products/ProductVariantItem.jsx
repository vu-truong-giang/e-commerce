import {
  getDataForOrderDetailItemsByOrderId,
  handleOptionCombination,
} from "../../assets/data/FunctionData";

export default function ProductVariantItem({ id }) {
  const data = getDataForOrderDetailItemsByOrderId(id);
  
  return (
    <>
      {data.map((item, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.product_name}</td>
          <td>
            {handleOptionCombination(item.variants[0].option_combination)}
          </td>
          
          <td>{item.variants[0].skud}</td>
          <td>{item.variants[0].price.toLocaleString("vi-VN")}</td>
          <td>{item.variants[0].quantity}</td>
          <td>
            {(
              item.variants[0].price * item.variants[0].quantity
            ).toLocaleString("vi-VN")}
          </td>
        </tr>
      ))}
    </>
  );
}
