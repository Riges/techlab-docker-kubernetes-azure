import * as React from 'react';
import { Button } from 'reactstrap';

interface StepProps {
  text: string;
  completed: boolean;
  complete: () => void;
  cancel: () => void;
}

const Step = ({ text, complete, completed, cancel }: StepProps) => (
  <Button outline={!completed} color="primary" onClick={!completed ? complete : cancel}>
    {text}
  </Button>
);

export default Step;
