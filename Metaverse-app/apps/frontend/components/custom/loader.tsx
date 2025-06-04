import { PropagateLoader } from "react-spinners";

const Loader = ({classname}: {classname?: string}) => {
  return (
    <div className={classname}>
      <PropagateLoader color="#ffffff" size={5} />
    </div>
  );
};

export default Loader;
