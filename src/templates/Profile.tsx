import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import TextInput from "../components/UIkit/TextInput";

interface UserData {
  username: string;
  email: string;
  role: string;
}

interface AllUserData {
  id: string;
  username: string;
  email: string;
  role: string;
}

const Profile = () => {
  const auth = getAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [allUserData, setAllUserData] = useState<AllUserData[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedData, setEditedData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      
      const docRef = doc(db, "users", uid);
      const snapshot = await getDoc(docRef);
      const data = snapshot.data() as UserData;
      
      setUserData(data);
      setEditedData(data);
    }
    fetchUserData();
  }, []);

  
  useEffect(() => {
    const fetchAllUserData = async () => {
      try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AllUserData[];
        setAllUserData(data);
      } catch (error) {
        console.error("ユーザーデータの取得に失敗しました:", error);
      }
    }
    fetchAllUserData();
  }, []);

  const handleEdit = () => {
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!editedData || !auth.currentUser?.uid) return;

    if (editedData.username === "") {
      alert("会員名を入力してください");
      return;
    }

    if (editedData.email === "") {
      alert("メールアドレスを入力してください");
      return;
    }

    if (editedData.email !== userData?.email) {
      const isEmailExists = allUserData.some(user => 
        user.email === editedData.email && user.id !== auth.currentUser?.uid
      );
      
      if (isEmailExists) {
        alert("既に登録済みのメールアドレスです");
        return;
      }
    }

    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        username: editedData.username,
        email: editedData.email
      });
      setUserData(editedData);
      setOpenDialog(false);
    } catch (error) {
      console.error("更新に失敗しました:", error);
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setOpenDialog(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedData) return;
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="c-section-wrapin" style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
      <h2 className="u-text__headline u-text-center">プロフィール</h2>
      <div className="module-spacer--medium" />
      <Card sx={{ minWidth: 300, maxWidth: 579, margin: "0 auto", background: "#ffffffe0" }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            プロフィール情報
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            ユーザー情報
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, textAlign: "left" }}>
            <strong>会員名:</strong> {userData?.username}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, textAlign: "left" }}>
            <strong>メールアドレス:</strong> {userData?.email}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, textAlign: "left" }}>
            <strong>ステータス:</strong> {userData?.role}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained" onClick={handleEdit} sx={{ margin: "0 auto" }}>
            編集
          </Button>
        </CardActions>
      </Card>

      {/* 編集用ダイアログ */}
      <Dialog open={openDialog} onClose={handleCancel}>
        <DialogTitle>プロフィール編集</DialogTitle>
        <DialogContent>
          <div className="p-profile__form-group" style={{ marginTop: "10px" }}>
            <TextInput
              label="会員名"
              id="username"
              name="username"
              value={editedData?.username || ""}
              onChange={handleChange}
            />
          </div>
          <div className="p-profile__form-group" style={{ marginTop: "20px" }}>
            <TextInput
              label="メールアドレス"
              id="email"
              name="email"
              value={editedData?.email || ""}
              onChange={handleChange}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            キャンセル
          </Button>
          <Button onClick={handleSave} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default Profile;
