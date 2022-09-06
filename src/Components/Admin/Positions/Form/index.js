import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  createPosition,
  getPositionById,
  getPositions,
  updatePosition
} from 'redux/Positions/thunks';
import { getClients } from 'redux/Clients/thunks';
import { getProfiles } from 'redux/Profiles/thunks';
import { closeErrorModal, clearSelectedPosition } from 'redux/Positions/actions';
import { Form, Field } from 'react-final-form';
import useQuery from 'Hooks/useQuery';
import styles from './form.module.css';
import Select from 'Components/Shared/Select';
import Input from 'Components/Shared/Input';
import Checkbox from 'Components/Shared/Checkbox';
import ButtonCancel from 'Components/Shared/Buttons/ButtonCancel';
import ButtonConfirm from 'Components/Shared/Buttons/ButtonConfirm';
import ModalError from 'Components/Shared/Modals/ModalError';

const PositionsForm = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [positionId, setPositionId] = useState(undefined);
  const clients = useSelector((store) => store.clients.list);
  const profiles = useSelector((store) => store.profiles.list);
  const [clientValue, setClientValue] = useState('');
  const [profilesValue, setProfilesValue] = useState('');
  const [jobDescriptionValue, setJobDescriptionValue] = useState('');
  const [vacancyValue, setVacancyValue] = useState('');
  const [isOpenValue, setIsOpenValue] = useState(false);
  const error = useSelector((store) => store.positions.error);
  const query = useQuery();

  useEffect(() => {
    const positionId = query.get('_id');
    dispatch(getProfiles());
    dispatch(getClients());
    if (positionId) {
      dispatch(getPositionById(positionId)).then((selectedPosition) => {
        setPositionId(positionId);
        setClientValue(selectedPosition.client._id);
        setProfilesValue(selectedPosition.professionalProfiles._id);
        setJobDescriptionValue(selectedPosition.jobDescription);
        setVacancyValue(selectedPosition.vacancy);
        setIsOpenValue(selectedPosition.isOpen);
      });
    } else {
      dispatch(clearSelectedPosition());
    }
  }, []);

  const submitPosition = (formValues) => {
    const positionID = query.get('_id');
    if (positionID) {
      dispatch(
        updatePosition(positionID, {
          client: formValues.client,
          jobDescription: formValues.jobDescription,
          vacancy: formValues.vacancy,
          professionalProfiles: formValues.professionalProfiles,
          isOpen: formValues.isOpen
        })
      ).then((response) => {
        if (response) {
          history.push('/admin/positions');
          dispatch(getPositions());
        }
      });
    } else {
      dispatch(
        createPosition({
          client: formValues.client,
          jobDescription: formValues.jobDescription,
          vacancy: formValues.vacancy,
          professionalProfiles: formValues.professionalProfiles,
          isOpen: formValues.isOpen
        })
      ).then((response) => {
        if (response) {
          history.push('/admin/positions');
          dispatch(getPositions());
        }
      });
    }
  };

  const required = (value) => (value ? undefined : 'Required');

  return (
    <div className={styles.container}>
      <Form onSubmit={submitPosition}>
        {(formProps) => (
          <form className={styles.form} onSubmit={formProps.handleSubmit}>
            <div className={styles.header}>
              <h2 className={styles.title}>
                {positionId ? 'Update a Position' : 'Create a Position'}
              </h2>
            </div>
            <div className={styles.fields}>
              <div className={styles.columns}>
                <Field
                  className={styles.select}
                  name="client"
                  label={'Clients'}
                  title={'Select a Client'}
                  initialValue={clientValue}
                  object={clients}
                  component={Select}
                  disabled={formProps.submitting}
                  validate={required}
                />
                <Field
                  label={'Job Description'}
                  name="jobDescription"
                  initialValue={jobDescriptionValue}
                  placeholder={'Write a job description'}
                  component={Input}
                  disabled={formProps.submitting}
                  validate={required}
                />
                <Field
                  label={'Is Open?'}
                  name="isOpen"
                  type="checkbox"
                  initialValue={isOpenValue}
                  component={Checkbox}
                  disabled={formProps.submitting}
                />
              </div>
              <div className={styles.columns}>
                <Field
                  className={styles.select}
                  name="professionalProfiles"
                  label={'Profiles'}
                  title={'Select a Profile'}
                  initialValue={profilesValue}
                  object={profiles}
                  component={Select}
                  disabled={formProps.submitting}
                  validate={required}
                />
                <Field
                  label={'Vacancy'}
                  name="vacancy"
                  type={'number'}
                  initialValue={vacancyValue}
                  placeholder={'Set the number of vacancies'}
                  component={Input}
                  disabled={formProps.submitting}
                  validate={required}
                />
              </div>
            </div>
            <div className={styles.button}>
              <ButtonCancel
                disabled={formProps.submitting}
                onClick={() => history.push('/admin/positions/')}
              />
              <ButtonConfirm disabled={formProps.submitting || formProps.pristine} type="submit" />
            </div>
            <ModalError error={error} onConfirm={() => dispatch(closeErrorModal())} />
          </form>
        )}
      </Form>
    </div>
  );
};

export default PositionsForm;
