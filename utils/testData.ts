import { RegistrationData } from '../pages/RegistrationPage';

export function createUniqueUser(): RegistrationData {
  const unique = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

  return {
    firstName: 'Milica',
    lastName: 'Radovic',
    email: `milica.radovic+${unique}@gmail.com`,
    password: 'Milicatest123!',
  };
}