import { push } from "connected-react-router";
import { useDispatch } from "react-redux";

const Footer = () => {
  const dispatch = useDispatch();
  return (
    <div>
      Footer
      <button onClick={() => {dispatch(push('/'))}}>page / へ移動</button>
    </div>
  )

}

export default Footer;
