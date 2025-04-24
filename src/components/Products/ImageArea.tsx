import { IconButton } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { makeStyles } from "@mui/styles";
import { useCallback, useRef } from "react";
import { storage, auth } from "../../firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import ImagePreview from "./ImagePreview";
import { ImageAreaProps } from "./types";

const useStyles = makeStyles({
  imageArea: {
    width: "48px !important",
    height: "48px !important",
  },
});

const ImageArea = (props: ImageAreaProps) => {
  const classes = useStyles();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setImage, setImages, images } = props;

  const handleButtonClick = () => {
    if (!auth.currentUser) {
      alert("画像をアップロードするにはログインが必要です。");
      return;
    }
    fileInputRef.current?.click();
  };

  const deleteImage = useCallback((id: string) => {
    const ret = window.confirm('この画像を削除しますか？');
    if (!ret) {
      return false;
    } else {
      if (images && setImages) {
        const newImages = images.filter((image) => image.id !== id);
        setImages(newImages);
        
        // 削除時も同じパス構造を使用
        const imageRef = ref(storage, `images/${id}`);
        return deleteObject(imageRef).catch((error) => {
          console.error("画像の削除に失敗しました:", error);
          alert("画像の削除に失敗しました。");
        });
      }
      return false;
    }
  }, [images, setImages]);

  const uploadImage = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        // ランダムなファイル名を生成
        const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const N = 16;
        const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N)))
          .map((n) => S[n % S.length])
          .join("");

        // images/ファイル名 の形式で保存
        const storageRef = ref(storage, `images/${fileName}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // 単一画像URLと画像配列の両方を更新
        setImage(downloadURL);

        // 重要: images配列も更新する必要があります
        if (setImages) {
          const newImage = { id: fileName, path: downloadURL };
          setImages((prevImages) => [...prevImages, newImage]);
        }
      } catch (error) {
        console.error("画像のアップロードに失敗しました:", error);
        alert("画像のアップロードに失敗しました。ログイン状態を確認してください。");
      }
    },
    [setImage, setImages]
  );

  return (
    <div>
      <div className="p-grid_list-image">
        {props.images &&
          props.images.length > 0 &&
          props.images.map((image: { id: string; path: string }) => (
            <ImagePreview delete={deleteImage} id={image.id} key={image.id} path={image.path} />
          ))}
      </div>
      <div className="u-text-right">
        <span>商品画像を登録する</span>
        <IconButton className={classes.imageArea} onClick={handleButtonClick}>
          <AddPhotoAlternateIcon />
        </IconButton>
        <input
          className="u-display-none"
          type="file"
          id="image"
          ref={fileInputRef}
          accept="image/*"
          onChange={(e) => {
            uploadImage(e);
          }}
        />
      </div>
    </div>
  );
};

export default ImageArea;
