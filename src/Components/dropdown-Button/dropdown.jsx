import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import './dropdown.css';
function BasicButtonExample() {
  return (
    <DropdownButton id="dropdown-basic-button" title="Search Role">
      <Dropdown.Item href="">Super-Admin</Dropdown.Item>
      <Dropdown.Item href="">Admin</Dropdown.Item>
      <Dropdown.Item href="">Teacher</Dropdown.Item>
      <Dropdown.Item href="">Student</Dropdown.Item>
      <Dropdown.Item href="">Operator</Dropdown.Item>
    </DropdownButton>
  );
}

export default BasicButtonExample;