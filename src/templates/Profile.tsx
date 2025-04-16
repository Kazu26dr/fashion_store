import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { PrimaryButton } from "../components/UIkit";
import { Button } from "@mui/material";
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
  const [isEditing, setIsEditing] = useState(false);
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

  console.log("allUserData", allUserData);
  const handleEdit = () => {
    setIsEditing(true);
  };
  console.log("editedData", editedData);
  console.log("userData", userData);
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
      setIsEditing(false);
    } catch (error) {
      console.error("更新に失敗しました:", error);
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
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
      <div className="c-container">
        <div className="p-profile__container">
          {isEditing ? (
            <div className="p-profile__edit-form">
              <div className="p-profile__form-group">
                <TextInput
                  label="会員名"
                  id="username"
                  name="username"
                  value={editedData?.username || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="p-profile__form-group">
                <TextInput
                  label="メールアドレス"
                  id="email"
                  name="email"
                  value={editedData?.email || ""}
                  onChange={handleChange}
                />
              </div>
              <div className= "module-spacer--small" />
              <div className="p-profile__button-group">
                <Button onClick={handleSave} variant="contained">
                  保存
                </Button>
                <Button onClick={handleCancel} variant="contained" color="inherit">
                キャンセル
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-profile__info">
              <div className="p-profile__item">
                <h3>会員名</h3>
                <p>{userData?.username}</p>
              </div>
              <div className="p-profile__item">
                <h3>メールアドレス</h3>
                <p>{userData?.email}</p>
              </div>
                <div className="p-profile__item">
                <h3>ステータス</h3>
                <p>{userData?.role}</p>
              </div>
              <div className= "module-spacer--small" />
              <PrimaryButton onClick={handleEdit} label="編集" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;
