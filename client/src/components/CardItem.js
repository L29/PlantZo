import React from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router";
import { selectCurrentUser } from "../redux/user/user.selectors";

const CardItem = ({ item, history }) => {
  const currentUser = useSelector((state) => selectCurrentUser(state));
  const { name, image: imageUrl, pid, price, rating } = item;

  let nameEdited = name;

  if (name.length > 16) {
    nameEdited = [name.slice(0, 14), "..."].join("");
  }

  const startArray = Array.from(new Array(Math.floor(rating)));

  const handleClick = () => {
    if (currentUser !== null) {
      history.push(`shop/${pid}`);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div
      className="flex flex-col w-72 items-center h-full bg-gray-100 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex w-11/12 h-3/4 mt-2">
        <img src={imageUrl} alt="Item" height={400} width={400} />
      </div>
      <div className="text-left">
        <h3 className="text-3xl mt-2">{nameEdited}</h3>
        <p className="text-2xl font-semibold">RP {price}.000</p>
        <div className="text-2xl">
          <span className="flex">
            {startArray.map((x, idx) => (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-yellow-300"
                viewBox="0 0 20 20"
                fill="currentColor"
                key={idx}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-lg text-gray-400 ml-10">Terjual {pid}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default withRouter(CardItem);
