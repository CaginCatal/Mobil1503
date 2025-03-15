import React, { useEffect, useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonCardContent, IonLoading
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { UserService } from '../services/UserService';
import { User } from '../models/User';
import './Menu.css';

const Menu: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await UserService.getCurrentUser();
        
        if (!currentUser) {
          // Kullanıcı oturum açmamışsa login sayfasına yönlendir
          history.push('/login');
          return;
        }
        
        setUser(currentUser);
      } catch (error: any) {
        console.error('Kullanıcı kontrolü sırasında hata:', error);
        history.push('/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [history]);

  const handleLogout = async () => {
    try {
      await UserService.logout();
      history.push('/login');
    } catch (error: any) {
      console.error('Çıkış sırasında hata:', error);
    }
  };

  // "Verilerimi Test Et" butonuna tıklandığında sayfaya yönlendirme
  const handleTestDataRedirect = () => {
    history.push('/verileri-test-et');
  };

  if (loading) {
    return (
      <IonPage>
        <IonLoading isOpen={loading} message={'Yükleniyor...'} />
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ana Menü</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Hoş Geldiniz</IonCardSubtitle>
            <IonCardTitle>{user?.fullName}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Kullanıcı Adı: {user?.username}</p>
            <p>E-posta: {user?.email}</p>
          </IonCardContent>
        </IonCard>

        {/* Verilerimi Test Et Butonu */}
        <IonButton expand="block" onClick={handleTestDataRedirect} color="primary" className="ion-margin-top">
          Verilerimi Test Et
        </IonButton>

        <IonButton expand="block" onClick={handleLogout} color="danger" className="ion-margin-top">
          Çıkış Yap
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Menu;
