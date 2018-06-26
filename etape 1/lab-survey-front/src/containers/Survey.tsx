import * as React from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { Dispatch } from 'redux';
import Step from '../components/Step';
import { ApplicationState } from '../store/reducers';
import { stepCanceled, stepCompleted } from '../store/survey/actions';
import { SurveyState } from '../store/survey/types';

interface PropsFromDispatch {
  stepCanceled: (step: number) => void;
  stepCompleted: (step: number) => void;
}

const mapStateToProps = (applicationState: ApplicationState): SurveyState => applicationState.survey;

const mapDispatchToProps = (dispatch: Dispatch<SurveyState>): PropsFromDispatch => {
  return {
    stepCanceled: (step: number) => dispatch(stepCanceled(step)),
    stepCompleted: (step: number) => dispatch(stepCompleted(step))
  };
};

class SurveyComponent extends React.Component<PropsFromDispatch & SurveyState> {
  public render() {
    const steps = [1, 2, 3].map((i, index) => (
      <Col key={index} sm={{ size: 2 }}>
        <Step
          text={'Etape ' + i}
          completed={this.props.completedSteps.has(i)}
          complete={() => this.props.stepCompleted(i)}
          cancel={() => this.props.stepCanceled(i)}
        />
      </Col>
    ));

    return <Row className="justify-content-center">{steps}</Row>;
  }
}

const Survey = connect(mapStateToProps, mapDispatchToProps)(SurveyComponent);
export default Survey;
