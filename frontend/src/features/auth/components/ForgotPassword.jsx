import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import { resetPasswordRequestAsync, selectMailSent } from '../authSlice';
import styled from 'styled-components';

const StyledForgotPage = styled.div`
  background-color: ${props => props.theme.background} !important;
  color: ${props => props.theme.text} !important;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s ease;

  h2 {
    color: ${props => props.theme.text} !important;
  }

  p {
    color: ${props => props.theme.textMuted} !important;
  }

  label {
    color: ${props => props.theme.text} !important;
  }

  input {
    background-color: ${props => props.theme.surface} !important;
    color: ${props => props.theme.text} !important;
    border: 1px solid ${props => props.theme.border} !important;
    outline: none !important;
    transition: all 0.2s ease !important;

    &:focus {
      border-color: ${props => props.theme.primary} !important;
      box-shadow: 0 0 0 3px ${props => props.theme.glow} !important;
    }
  }
`;

const StyledForgotCard = styled.div`
  background-color: ${props => props.theme.cardBg} !important;
  border: 1px solid ${props => props.theme.border} !important;
  box-shadow: ${props => props.theme.shadow} !important;
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  transition: all 0.3s ease;
`;

export default function ForgotPassword() {

 const mailSent = useSelector(selectMailSent);
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  console.log(errors);

  return (
    <>
      <StyledForgotPage className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="/ecommerce.png"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
            Enter email to reset password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <StyledForgotCard>
          <form
            noValidate
            onSubmit={handleSubmit((data) => {
              console.log(data);
              dispatch(resetPasswordRequestAsync(data.email))
              
            })}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  {...register('email', {
                    required: 'email is required',
                    pattern: {
                      value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                      message: 'email not valid',
                    },
                  })}
                  type="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
                {mailSent && (
                  <p className="text-green-500">Mail Sent</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Send Email
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Send me back to{' '}
            <Link
              to="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Login
            </Link>
          </p>
          </StyledForgotCard>
        </div>
      </StyledForgotPage>
    </>
  );
}
