import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonInput, IonButton, IonItem, IonLabel, IonLoading, IonAlert, IonIcon
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { UserService } from '../services/UserService';
import { eye, eyeOff } from 'ionicons/icons'; // Eye iconları import ediliyor
import './Login.css';  // CSS dosyanızın import'u

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);  // Şifreyi gösterme durumu
  const history = useHistory();

  const handleLogin = async () => {
    // Form validasyonu
    if (!username || !password) {
      setAlertMessage('Lütfen kullanıcı adı ve şifre girin');
      setShowAlert(true);
      return;
    }
    
    try {
      setShowLoading(true);
      
      const user = await UserService.login(username, password);
      
      setShowLoading(false);
      
      if (user) {
        // Giriş başarılı, menü sayfasına yönlendir
        history.push('/menu');
      }
      
    } catch (error: any) {
      setShowLoading(false);
      setPassword(''); // Şifreyi sıfırla
      setAlertMessage('Kullanıcı adı veya şifre hatalı. Kayıtlı değilseniz lütfen kayıt olun.');
      setShowAlert(true);
    }
  };

  // Şifreyi göster-gizle işlevi
  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.stopPropagation(); // Bu satır, input kutusunun tıklanmasını engeller
    setShowPassword(!showPassword);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Giriş Yap</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="login-form">
          <IonItem>
            <IonLabel position="floating">Kullanıcı Adı</IonLabel>
            <IonInput 
              value={username} 
              onIonChange={(e) => setUsername(e.detail.value!)} 
              required
            />
          </IonItem>
          
          <IonItem>
            <IonLabel position="floating">Şifre</IonLabel>
            <IonInput 
              type={showPassword ? "text" : "password"}  // Şifreyi gösterme/gizleme işlevi
              value={password} 
              onIonChange={(e) => setPassword(e.detail.value!)} 
              required
            />
            <IonIcon
              slot="end"
              icon={showPassword ? eye : eyeOff}
              onClick={togglePasswordVisibility}  // Şifreyi göster/gizle fonksiyonu
              style={{ cursor: 'pointer' }}
            />
          </IonItem>
          
          <IonButton expand="block" onClick={handleLogin} className="ion-margin-top">
            Giriş Yap
          </IonButton>
          
          <IonButton expand="block" fill="clear" routerLink="/register" className="ion-margin-top">
            Hesabınız yok mu? Kayıt Ol
          </IonButton>
        </div>
        
        <IonLoading
          isOpen={showLoading}
          message={'Giriş yapılıyor...'}
        />
        
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Bilgi'}
          message={alertMessage}
          buttons={['Tamam']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
