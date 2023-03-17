import './App.css';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  MenuItem,
  TextField
} from '@mui/material'
import { Field, Form, Formik, FieldArray } from 'formik';
import * as Yup from "yup";
import axios from 'axios'
import Swal from 'sweetalert2'
import Select, { SelectChangeEvent } from '@mui/material/Select';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0069B3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f3f6f9',
    },
  },
});

const TOPICS = [
  "ES6 features",
  "JavaScript frameworks",
  "JavaScript performance optimization",
  "JavaScript testing libraries",
  "JavaScript design patterns",
  "JavaScript debugging techniques",
  "JavaScript best practices",
  "JavaScript tooling and build systems",
  "JavaScript security",
  "JavaScript functional programming",
  "JavaScript object-oriented programming",
  "JavaScript async programming",
  "JavaScript DOM manipulation",
  "JavaScript event handling",
  "JavaScript animations",
  "JavaScript data structures and algorithms"
]

const axiosInstance = axios.create({
  baseURL: 'https://talkk7devcms.talkk.in',
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'NjFkZDU1Mjk1MzA2YTEyODk3ZWFiN2Zh'
  },
  timeout: 100000
})

function App() {

  const initialValues = { 
    title: "",
    topics: [],
    question: []
  }

  const validationSchema = () => {
    Yup.object().shape({
      title: Yup.string().trim().required("This field is required"),
      topics: Yup.string().trim().required("This field is required"),
    })
  }
  
  const handleOnReset = () => {

  }

  const handleOnSubmit = async (formData) =>  {
    const req = {
      data: {
        "_action": "saveIntent",
        "_param": {
            "company_id": "61385f841b0a8a7b682470e7",
            "group_id": "6364dd6c1fd28b0cddf237a9",
            "intent_name": "test",
            "intent_type": "qna",
            "token": "MTY3ODc3MjQ0NDI2OV82MTM4NWY4NDFiMGE4YTdiNjgyNDcwZTdfNjEzODVmODQxYjBhOGE3YjY4MjQ3MGVh",
            "language": "en",
            "user_id": "61385f841b0a8a7b682470ea",
            "topics": [],
            "question": {
                "en": [
                    "test",
                    "Test 1",
                    "Test 2",
                    "Test 3",
                    "Test 4",
                    "Test 5"
                ]
            },
            "response": {
                "Web": {
                    "en": [
                        {
                            "text_input": [
                                {
                                    "text": "Test Response",
                                    "type": "text"
                                }
                            ],
                            "ssml_input": ""
                        }
                    ]
                }
        }
      }
    }
  }

    const url = '/api/v1/apiai'

    await axiosInstance.post(url, req).then((res) => {
      console.log(res)
      if(res.status === 200){
          Swal.fire(
            'Form Submited',
            'success'
          )
      } else {
        Swal.fire(
          'Form Submition failed',
          'error'
        )
      }
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <header className='sticky top-0 w-full bg-neutral-100 shadow-md z-40 backdrop-blur'>
          <nav className='relative mx-auto h-14 flex items-center justify-center overflow-hidden'>
            <div className='text-lg text-center'>Add Q&A</div>
          </nav>
        </header>

        <main className='container mx-auto'>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleOnSubmit}
          >
            {({ values, errors, touched, setFieldValue }) => {
              return (
                <Form noValidate>
                  <div className='my-4 grid grid-cols-2  gap-4 '>
                    <div>
                      <label className='form-label' htmlFor='title'>
                        Title Question <span className='text-red-500'>*</span>
                      </label>
                      <Field
                        id='title'
                        name='title'
                        label=''
                        placeholder=''
                        as={TextField}
                        variant='outlined'
                        margin='none'
                        type='text'
                        fullWidth
                        error={Boolean(touched.title && errors.title)}
                        helperText={touched.title && errors.title}
                      />
                    </div>
                    <div>
                      <label className='form-label' htmlFor='topics'>
                        Topic
                      </label>
                      <FormControl
                      variant='standard'
                      error={Boolean(touched.topics && errors.topics)}
                      fullWidth
                    >
                      <Select
                        name='topics'
                        id='topics'
                        onChange={(e) => {
                          const {
                            target: { value },
                          } = e;
                          setFieldValue('topics',
                            typeof value === 'string' ? value.split(',') : value,
                          );
                          // setFieldValue( e.target.value)
                          console.log(e.target)
                        }}
                        multiple
                        displayEmpty
                        sx={{ minWidth: '50%', paddingTop: 1, paddingBottom: 1 }}
                        size='small'
                        variant='outlined'
                        value={values.topics}
                        renderValue={(selected) => {
                          return selected.join(', ');
                        }}
                      >
                        <MenuItem value='' disabled>
                          Select
                        </MenuItem>
                        {TOPICS.map((item, index) => {
                          return (
                            <MenuItem key={'type-list-' + index} value={item}>
                              {item}
                            </MenuItem>
                          )
                        })}
                      </Select>
                      {touched.topics && errors.topics ? (
                        <FormHelperText sx={{ textAlign: 'left' }}>
                          {String(errors.topics)}
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                    </div>
                  </div>

                  <div className='flex gap-2 justify-center'>
                    <Button variant='outlined' type="reset" onClick={handleOnReset}>Cancel</Button>
                    <Button variant="contained" type="submit">Save</Button>
                  </div>
                </Form>
              )
            }}
          </Formik>
        </main>
    </ThemeProvider>
  );
}

export default App;
