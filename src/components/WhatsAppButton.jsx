import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import '../styles/components/WhatsAppButton.css';

const WhatsAppButton = () => {
  const location = useLocation();
  const phoneNumber = '923298650167';
  const message = encodeURIComponent('Hello! I would like to inquire about your services.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  // Hide on ERP or Auth pages to keep the workspace clean
  const isExcludedPage = location.pathname.startsWith('/erp') || location.pathname.startsWith('/auth');

  if (isExcludedPage) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      title="Contact us on WhatsApp"
    >
      <div className="whatsapp-ping"></div>
      <FaWhatsapp className="whatsapp-icon" />
      <span className="whatsapp-tooltip">Chat with us</span>
    </a>
  );
};

export default WhatsAppButton;
