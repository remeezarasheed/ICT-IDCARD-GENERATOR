import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Adminhome from './component/home/Adminhome';
import Applyidcard from './component/home/Applyidcard';
import Bmhome from './component/home/Bmhome';
import Coursedropdown from './component/home/Coursedropdown';
import Home from './component/home/Home';
import Userhome from './component/home/Userhome';
import Login from './component/login/Login';
import Idstatus from './component/registeruser/Idstatus';
import Regstudent from './component/registeruser/Regstudent';
import Pdfmaker from './component/registeruser/Pdfmaker';
import Formcontrol from './component/admin/Formcontrol';
import Userhomed from './component/home/Userhomed';
import Idstatuss from './component/registeruser/Idstatuss';
import BatchManager from './component/batchmanager/BatchManager.jsx';
import NewBatchManager from './component/newbatchmanager/NewBatchManager.jsx';
import ForgotPwd from './component/forgotpasswrd/ForgotPwd';
import PendingList from './component/home/PendingList';
import Approvedlist from './component/home/Approvedlist';
import Error from './component/error/Error';



function App() {
  return (

    <Router>
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Regstudent />} />
        <Route path="/userhomed" element={<Userhome />} />
        <Route path="/userhome" element={<Userhomed />} />
        <Route path="/:id/idstatus" element={<Idstatuss/>} />

        <Route path="/adminhome" element={<Adminhome />} />
        <Route path="/bmhome" element={<Bmhome />} />
        <Route path="/:id/applyidcard" element={<Applyidcard />} />
        <Route path="/Coursedropdown" element={<Coursedropdown />} />
        <Route path="/:id/idstatuss" element={<Idstatus/>} />
        <Route path="/:id/pdf" element={<Pdfmaker/>} />
        <Route path="/formcontrol" element={<Formcontrol/>} />
        <Route path="/batchmanagers" element={<BatchManager />} />
        <Route path="/newbatchmanagers" element={<NewBatchManager />} />
        <Route path="/forgotPassword" element={<ForgotPwd />} />
        <Route path="/:id/showmypendingilst" element={<PendingList />} />
        <Route path="/:id/history" element={<Approvedlist />} />
        <Route path="*" element={<Error />} />
        
        


        {/* <Route path="*" element={<Error />} /> */}
      </Routes>
    </>
    </Router>


  
  );
}

export default App;
