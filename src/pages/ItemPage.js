import React from "react";
import { withRouter } from "react-router";

import LabelLink from "../components/LabelLink";

const ItemPage = ({ match }) => {
  return (
    <div className="h-screen">
      <LabelLink>
        <span className="mb-2 mr-2">&larr;</span>
        <span>Deskripsi produk</span>
      </LabelLink>
      <div className="h-2/3 mx-2 my-4 p-12 bg-gray-100">
        <div className="h-full flex space-x-14">
          <div className="w-1/4">
            <img
              src="https://public.urbanasia.com/images/post/2020/09/29/1601351424-aglonema.jpg"
              alt="Item"
            />
          </div>
          <div className="flex-auto h-full -mt-5">
            <div className="flex flex-col justify-center items-start m-14">
              <h2>Tanaman keladi</h2>
              <div>rating</div>
              <h3>Harga</h3>
              <div>Optional</div>
              <div>kuantitas</div>
              <div>ContainerButton</div>
            </div>
          </div>
        </div>
      </div>
      <LabelLink>Testing param Url : {match.params.itemId}</LabelLink>
    </div>
  );
};

export default withRouter(ItemPage);
