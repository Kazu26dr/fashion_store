import React, { useCallback, useEffect, useState } from "react";
import { TextInput, SelectBox, PrimaryButton } from "../components/UIkit";
import { useDispatch } from "react-redux";
import { saveProduct } from "../redux/products/operations";
import { AppDispatch } from "../redux/store/store";
import { useNavigate } from "react-router-dom";
import ImageArea from "../components/Products/ImageArea";
import { db } from "../firebase";
import { doc, getDoc, query, orderBy, getDocs, collection } from "firebase/firestore";
import { ProductDataFirestore } from "../redux/products/types";
import SetSizeArea from "../components/Products/SetSizeArea";
import { getAuth } from "firebase/auth";

const ProductEdit = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const auth = getAuth();
  let id = window.location.pathname.split("/product/edit")[1];
  console.log(id);
  if (id !== "") {
    id = id.split("/")[1];
  }

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [gender, setGender] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [images, setImages] = useState<Array<{ id: string; path: string }>>([]);
  const [sizes, setSizes] = useState<Array<{ size: string; quantity: number }>>(
    []
  );

  const inputName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    [setName]
  );

  const inputDescription = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(e.target.value);
    },
    [setDescription]
  );

  const inputPrice = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPrice(e.target.value);
    },
    [setPrice]
  );

  const genders = [
    { id: "all", name: "All" },
    { id: "male", name: "Men" },
    { id: "female", name: "Women" },
  ];

  useEffect(() => {
    if (id !== "") {
      const docRef = doc(db, "products", id);
      getDoc(docRef).then((snapshot) => {
        const data = snapshot.data() as ProductDataFirestore;
        if (data) {
          setName(data.name);
          setDescription(data.description);
          setCategory(data.category);
          setGender(data.gender);
          setPrice(data.price.toString());
          setImages(
            data.images
              ? data.images.map((path) => ({
                  id: path.split("/").pop() || "",
                  path,
                }))
              : []
          );
          setSizes(data.sizes);
        }
      });
    }
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesRef = collection(db, "categories");
      const q = query(categoriesRef, orderBy("order", "asc"));
      const snapshot = await getDocs(q);
      const categoriesData = snapshot.docs.map((doc) => ({
        id: doc.data().id,
        name: doc.data().name,
      }));
      setCategories(categoriesData);
    };
    fetchCategories();
  }, []);
  return (
    <section className="c-section-container">
      <h2 className="u-text__headline u-text__center">商品の登録・編集</h2>

      <div className="c-edit-container">
        <ImageArea
          image={image}
          setImage={setImage}
          images={images}
          setImages={setImages}
        />
        <TextInput
          fullWidth={true}
          label={"商品名"}
          multiline={false}
          required={true}
          onChange={inputName}
          rows={1}
          value={name}
          type="text"
        />
        <TextInput
          fullWidth={true}
          label={"商品説明"}
          multiline={true}
          required={true}
          onChange={inputDescription}
          rows={5}
          value={description}
          type="text"
        />
        <SelectBox
          label={"カテゴリー"}
          options={categories}
          required={true}
          select={setCategory}
          value={category}
        />
        <SelectBox
          label={"性別"}
          options={genders}
          required={true}
          select={setGender}
          value={gender}
        />
        <TextInput
          fullWidth={true}
          label={"価格"}
          multiline={false}
          required={true}
          onChange={inputPrice}
          rows={1}
          value={price}
          type="number"
        />
        <div className="module-spacer--small"></div>
        <SetSizeArea sizes={sizes} setSizes={setSizes} />
        <div className="module-spacer--small"></div>
        <div className="center">
          <PrimaryButton
            label={"商品情報を保存"}
            onClick={() =>
              dispatch(
                saveProduct(
                  id,
                  name,
                  description,
                  Number(price),
                  category,
                  gender,
                  images.map((img) => img.path),
                  sizes,
                  auth.currentUser?.uid || "",
                  navigate
                )
              )
            }
          />
        </div>
      </div>
    </section>
  );
};

export default ProductEdit;
