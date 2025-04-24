import { ImagePreviewProps } from "./types";
const ImagePreview = (props: ImagePreviewProps) => {
  return (
    <div className="p-media__thumb" onClick={() => props.delete(props.id)}>
        <img src={props.path} alt="プレビュー" />
    </div>
  )
}

export default ImagePreview;