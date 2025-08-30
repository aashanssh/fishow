// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Fish,
//   ChevronDown,
//   Package,
//   TruckIcon,
//   LogOut,
//   User,
//   CreditCardIcon,
//   PlusCircle,
// } from 'lucide-react';

// const AdminBoard: React.FC = () => {
//   const [loadDropdown, setLoadDropdown] = useState(false);
//   const [boxDropdown, setBoxDropdown] = useState(false);
//   const [paymentsDropdown, setPaymentsDropdown] = useState(false);
//   const [createDropdown, setCreateDropdown] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('isAuthenticated');
//     localStorage.removeItem('username');
//     navigate('/login');
//   };

//   const username = localStorage.getItem('username') || 'Admin';

//   return (
//     <nav className="bg-white shadow-sm border-b border-gray-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo and Brand */}
//           <div className="flex items-center">
//             <div className="flex items-center space-x-3">
//               <div className="bg-blue-100 p-2 rounded-lg">
//                 <Fish className="w-6 h-6 text-blue-600" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">Fishow</h1>
//                 <p className="text-xs text-gray-500">Popular Fish ERP</p>
//               </div>
//             </div>
//           </div>

//           {/* Navigation Menu */}
//           <div className="flex items-center space-x-8">
//             {/* Home Button */}
//             <button
//               onClick={() => navigate('/dashboard')}
//               className="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
//             >
//               Home
//             </button>

//             {/* Load Menu */}
//             <div className="relative">
//               <button
//                 onClick={() => {
//                   setLoadDropdown(!loadDropdown);
//                   setBoxDropdown(false);
//                   setPaymentsDropdown(false);
//                   setCreateDropdown(false);
//                 }}
//                 className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//               >
//                 <TruckIcon className="w-5 h-5" />
//                 <span className="font-medium">Load</span>
//                 <ChevronDown className="w-4 h-4" />
//               </button>

//               {loadDropdown && (
//                 <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
//                   <button
//                     onClick={() => {
//                       navigate('/sales-entry');
//                       setLoadDropdown(false);
//                     }}
//                     className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
//                   >
//                     Cash Sales
//                   </button>
//                   <button
//                     onClick={() => {
//                       navigate('/load-wise-list');
//                       setLoadDropdown(false);
//                     }}
//                     className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
//                   >
//                     Sales Summary
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Box Menu */}
//             <div className="relative">
//               <button
//                 onClick={() => {
//                   setBoxDropdown(!boxDropdown);
//                   setLoadDropdown(false);
//                   setPaymentsDropdown(false);
//                   setCreateDropdown(false);
//                 }}
//                 className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//               >
//                 <Package className="w-5 h-5" />
//                 <span className="font-medium">Box</span>
//                 <ChevronDown className="w-4 h-4" />
//               </button>

//               {boxDropdown && (
//                 <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
//                   <button
//                     onClick={() => {
//                       navigate('/fish-box-sent');
//                       setBoxDropdown(false);
//                     }}
//                     className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
//                   >
//                     Box Sale
//                   </button>
//                   <button
//                     onClick={() => {
//                       navigate('/fish-box-received');
//                       setBoxDropdown(false);
//                     }}
//                     className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
//                   >
//                     Box Receive
//                   </button>
//                   <button
//                     onClick={() => {
//                       navigate('/multiple-box-update');
//                       setBoxDropdown(false);
//                     }}
//                     className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
//                   >
//                     Multiple Box Receive
//                   </button>
//                   <button
//                     onClick={() => {
//                       navigate('/box-sales-list');
//                       setBoxDropdown(false);
//                     }}
//                     className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
//                   >
//                     Box Sales List
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Payments Menu */}
//             <div className="relative">
//               <button
//                 onClick={() => {
//                   setPaymentsDropdown(!paymentsDropdown);
//                   setLoadDropdown(false);
//                   setBoxDropdown(false);
//                   setCreateDropdown(false);
//                 }}
//                 className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//               >
//                 <CreditCardIcon className="w-5 h-5" />{' '}
//                 {/* You can use any icon */}
//                 <span className="font-medium">Payments</span>
//                 <ChevronDown className="w-4 h-4" />
//               </button>

//               {paymentsDropdown && (
//                 <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
//                   <button
//                     onClick={() => {
//                       navigate('/collect-payments');
//                       setPaymentsDropdown(false);
//                     }}
//                     className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
//                   >
//                     Collect Payments
//                   </button>
//                   <button
//                     onClick={() => {
//                       navigate('/payments-list');
//                       setPaymentsDropdown(false);
//                     }}
//                     className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
//                   >
//                     Payment List
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Create Menu */}
//             <div className="relative">
//               <button
//                 onClick={() => {
//                   setCreateDropdown(!createDropdown);
//                   setPaymentsDropdown(false);
//                   setLoadDropdown(false);
//                   setBoxDropdown(false);
//                 }}
//                 className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//               >
//                 <PlusCircle className="w-5 h-5" /> {/* Any icon works */}
//                 <span className="font-medium">Create</span>
//                 <ChevronDown className="w-4 h-4" />
//               </button>

//               {createDropdown && (
//                 <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
//                   <button
//                     onClick={() => {
//                       navigate('/create-customer');
//                       setCreateDropdown(false);
//                     }}
//                     className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
//                   >
//                     Customer
//                   </button>
//                   <button
//                     onClick={() => {
//                       navigate('/create-party');
//                       setCreateDropdown(false);
//                     }}
//                     className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
//                   >
//                     Party
//                   </button>
//                   <button
//                     onClick={() => {
//                       navigate('/create-salesman');
//                       setCreateDropdown(false);
//                     }}
//                     className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
//                   >
//                     Salesman
//                   </button>
//                   <button
//                     onClick={() => {
//                       navigate('/create-item');
//                       setCreateDropdown(false);
//                     }}
//                     className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
//                   >
//                     Item
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* User Menu */}
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-2">
//               <User className="w-5 h-5 text-gray-500" />
//               <span className="text-sm text-gray-700">{username}</span>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="flex items-center space-x-1 px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
//             >
//               <LogOut className="w-4 h-4" />
//               <span className="text-sm">Logout</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default AdminBoard;

import { CreditCardIcon, Package, PlusCircle, TruckIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Brand from './Brand';
import UserMenu from './UserMenu';
import DropdownMenu from './DropdownMenu';
import NavButton from './NavButton';

const AdminBoard: React.FC = () => {
  const [loadDropdown, setLoadDropdown] = useState(false);
  const [boxDropdown, setBoxDropdown] = useState(false);
  const [paymentsDropdown, setPaymentsDropdown] = useState(false);
  const [createDropdown, setCreateDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const username = localStorage.getItem('username') || 'Admin';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Brand />

          {/* Navigation Menu */}
          <div className="flex items-center space-x-8">
            <NavButton label="Home" onClick={() => navigate('/dashboard')} />

            <DropdownMenu
              icon={<TruckIcon className="w-5 h-5" />}
              label="Load"
              isOpen={loadDropdown}
              setIsOpen={setLoadDropdown}
              onNavigate={navigate}
              items={[
                { label: 'Cash Sales', path: '/sales-entry' },
                { label: 'Sales Summary', path: '/load-wise-list' },
              ]}
            />

            <DropdownMenu
              icon={<Package className="w-5 h-5" />}
              label="Box"
              isOpen={boxDropdown}
              setIsOpen={setBoxDropdown}
              onNavigate={navigate}
              items={[
                { label: 'Box Sale', path: '/fish-box-sent' },
                { label: 'Box Receive', path: '/fish-box-received' },
                { label: 'Multiple Box Receive', path: '/multiple-box-update' },
                { label: 'Box Sales List', path: '/box-sales-list' },
              ]}
            />

            <DropdownMenu
              icon={<CreditCardIcon className="w-5 h-5" />}
              label="Payments"
              isOpen={paymentsDropdown}
              setIsOpen={setPaymentsDropdown}
              onNavigate={navigate}
              items={[
                { label: 'Collect Payments', path: '/collect-payments' },
                { label: 'Payment List', path: '/payments-list' },
              ]}
            />

            <DropdownMenu
              icon={<PlusCircle className="w-5 h-5" />}
              label="Create"
              isOpen={createDropdown}
              setIsOpen={setCreateDropdown}
              onNavigate={navigate}
              items={[
                { label: 'Customer', path: '/create-customer' },
                { label: 'Party', path: '/create-party' },
                { label: 'Salesman', path: '/create-salesman' },
                { label: 'Item', path: '/create-item' },
              ]}
            />
          </div>

          {/* User Menu */}
          <UserMenu username={username} onLogout={handleLogout} />
        </div>
      </div>
    </nav>
  );
};

export default AdminBoard;
