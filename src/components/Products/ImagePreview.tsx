
const ImagePreview = (props: {
    id: string;
    path: string;
    delete: (id: string) => void;
}) => {
  return (
    <div className="p-media__thumb" onClick={() => props.delete(props.id)}>
        <img src={props.path} alt="プレビュー" />
    </div>
  )
}

export default ImagePreview     