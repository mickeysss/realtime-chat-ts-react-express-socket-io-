import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Auth } from 'pages/Auth';
import { ChatRoom } from 'pages/ChatRoom';
import { useAction, useStore } from 'helpers/StoreContext';
import 'antd/dist/antd.css';

export function App() {
  const { ...state } = useStore();

  const { onLogin, addMessage, handleResetAdmin } = useAction();

  useEffect(() => {
    handleResetAdmin();
  }, [handleResetAdmin, state.isAdmin]);

  return (
    <div>
      {!state.joined ? (
        <Routes>
          <Route path="/" element={<Auth removedChat={state.removedChat} onLogin={onLogin} />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="rooms" element={<ChatRoom {...state} addMessage={addMessage} />} />
        </Routes>
      )}
    </div>
  );
}
