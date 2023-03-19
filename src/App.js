import './App.css';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Avatar,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Menu,
  Divider,
} from '@mui/material'
import ListItemIcon from '@mui/material/ListItemIcon';
import { Field, Form, Formik, FieldArray, ErrorMessage } from 'formik';
import * as Yup from "yup";
import axios from 'axios'
import Swal from 'sweetalert2'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#256cdc',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f3f6f9',
    },
  },
});

const IMG_SUPPORTED_FORMATES = ['image/jpg', 'image/jpeg', 'image/png']

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

const RESPONSE_BUTTONS = [
  {
    title: 'System Generated',
    subTitle: 'AI generated button'
  },
  {
    title: 'Quick Button',
    subTitle: 'Suggested Replies with intents'
  },
  {
    title: 'Link Button',
    subTitle: 'Add links to button'
  },
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

const ImgInput = ({ name, onChange, title, value }) => {
  return (
    <>
      <input
        type='file'
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        accept='image/*'
        className='hidden'
      />

      <label htmlFor={name}>
        <button
          className='py-4 px-8 bg-gray-100 border-dashed border-2 border-gray-500 font-semibold'
          type='button'
        >
           {title}
        </button>
      </label>
    </>
  )
}

function App() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [qna, setQna] = React.useState([
    {
      title: "question 1",
      type: "userMsg"
    },
    {
      title: "hello ",
      type: "botReply"
    },
  ])
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const initialValues = { 
    title: "",
    topics: [],
    question: [
      "hello",
      "hello",
      "hello",
      "hello",
      "hello",
    ],
    response: [
      {
        responseType: 'text',
        responseContent: 'hello'
      }
    ],
  }

  const validationSchema = Yup.object().shape({
      title: Yup.string().trim().required("This field is required"),
      topics: Yup.array().of(Yup.string().required("This field is required")),
      question: Yup.array().of(
        Yup.string().required("Please enter question synonym")
      ).min(3, 'Minimum 5 question required'),
      response: Yup.array().of(
        Yup.object().shape({
          responseContent: Yup.mixed().required('Required'),
          responseType: Yup.string(), // these constraints take precedence
        })
      ).min(1, 'Minimum 1 response required')
    })
  
  const handleOnReset = () => {

  }

  const handleOnSubmit = async (formData) =>  {
    console.log("formdata", formData)
    const url = '/api/v1/apiai'
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
            "topics": formData.topics,
            "question": {
                "en": formData.question
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

    // await axiosInstance.post(url, req).then((res) => {
    //   console.log(res)
    //   if(res.status === 200){
    //       Swal.fire(
    //         'Form Submited',
    //         'success'
    //       )
    //   } else {
    //     Swal.fire(
    //       'Form Submition failed',
    //       'error'
    //     )
    //   }
    // })
  }

  const handleImgChange = (e) => {

  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <header className='sticky top-0 w-full bg-neutral-100 shadow-md z-40 backdrop-blur'>
          {/* <div className='bg-[#E7F4E4] text-center'>434 record Updated/72 record Delted <span>Publish Now</span></div> */}
          <nav className='relative mx-auto h-14 flex items-center justify-center overflow-hidden'>
            <div className='text-lg text-center'>Add Q&A</div>
          </nav>
        </header>

        <main>
          <div className='flex grid-cols-2 gap-4 mx-4'>
            <div className='w-4/5'>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleOnSubmit}
              >
                {({ values, errors, touched, setFieldValue }) => {
                  return (
                    <Form noValidate>
                      <div className='my-4 grid grid-cols-2 gap-4 '>
                        <div>
                          <label className='text-sm font-semibold' htmlFor='title'>
                            Title Question <span className='text-red-500'>*</span>
                          </label>
                          <Field
                            id='title'
                            name='title'
                            label=''
                            placeholder=''
                            as={TextField}
                            variant='outlined'
                            type='text'
                            fullWidth
                            size="small"
                            error={Boolean(touched.title && errors.title)}
                            helperText={touched.title && errors.title}
                            className="bg-white"
                          />
                          <div className='text-xs my-2'>
                            Title is for your reference of this question. This will not display in chatbot anywhere.
                          </div>
                        </div>
                        <div>
                          <label className='text-sm font-semibold' htmlFor='topics'>
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
                              onChange={(event) =>
                                setFieldValue("topics", event.target.value)
                              }
                              multiple
                              displayEmpty
                              sx={{ background: '#ffffff', paddingTop: 0, paddingBottom: 0 }}
                              size='small'
                              margin='none'
                              variant='outlined'
                              value={values.topics}
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
                      
                      <div className='my-4'>
                        <div className='bg-white border border-slate-300 rounded'>
                          <div className='grid grid-cols-2 md:grid-rows-1 m-4 gap-4'>
                            <div>
                              <h4 className='font-medium'>Question</h4>
                              <hr className='my-2' />
                              <div>
                                <div className='text-xs italic my-2'>Below are auto-generated synonyms/utterances for the question, if required you can update or delete the generated synonyms/utterances</div>
                                <FieldArray
                                  name="question"
                                  render={arrayHelpers => (
                                    <div>
                                      {values['question'] && values['question'].length > 0 ? (
                                        <div>
                                          {values.question.map((question, idx) =>
                                            <div key={idx} className="my-4">
                                              <div className="flex gap-2">
                                                <Field
                                                  name={`question[${idx}]`}
                                                  label={`Question Synonym ${idx+1}`}
                                                  placeholder=''
                                                  as={TextField}
                                                  variant='outlined'
                                                  type='text'
                                                  fullWidth
                                                  // size="small"
                                                  margin="none"
                                                  multiline
                                                  rows={2}
                                                  // required
                                                  // error={Boolean(touched.question[idx] && errors.question[idx])}
                                                  // helperText={touched.question[idx] && errors.question[idx]}
                                                />
                                                {idx > 4 &&
                                                <IconButton onClick={() => arrayHelpers.remove(idx)} color="error" size="small">
                                                  <DeleteIcon fontSize='small' />
                                                </IconButton>}
                                              </div>
                                              {touched.question &&
                                                errors.question &&
                                                errors.question[idx] && (
                                                  <div className='text-xs text-red-500 my-2'>{errors.question[idx]}</div>
                                                )}
                                            </div>
                                          )}
                                        </div>
                                      ) : <Button variant='text' type="button" startIcon={<AddOutlinedIcon fontSize='small' />} className="!capitalize" onClick={() => arrayHelpers.push('')}>Add question synonyms</Button>                                  }
                                      {values.question.length > 0 ?
                                      <div>
                                        <div className='my-2 text-xs italic'>For more accuracy of chatbot to respond to your question add Synonyms of the questions</div>
                                        <Button variant='text' type="button" startIcon={<AddOutlinedIcon fontSize='small' />} className="!capitalize" onClick={() => arrayHelpers.push('')}>Add more question synonyms</Button>
                                      </div> : null}
                                    </div>
                                  )}
                                />
                                <ErrorMessage name='question' />
                              </div>

                            </div>
                            <div>
                              <h4 className='font-medium'>Response</h4>
                              <hr className='my-2' />
                              <div className='border border-slate-300 px-3 rounded'>
                                <FieldArray
                                  name="response"
                                  render={({ insert, remove, push, replace }) => (
                                    <div>
                                      {values['response'] && values['response'].length > 0 ? (
                                        <>
                                          <div>
                                            {values.response.map((res, idx) =>
                                              <div key={idx}>
                                                <div className='bg-[#d1e4fe] pt-2 pb-4 px-4 rounded-md my-3'>
                                                  <div className='flex justify-between items-center my-1'>
                                                    <div className='font-semibold'>{values.response[idx].responseType === "text" && 'Bots Message'}</div>
                                                    {idx > 0 &&
                                                    <IconButton onClick={() => remove(idx)} color="default" size="small">
                                                      <DeleteIcon fontSize='small' />
                                                    </IconButton>
                                                    }
                                                  </div>
                                                  {values.response[idx].responseType === "text" ?
                                                    <div>
                                                      <Field
                                                        name={`response[${idx}].responseContent`}
                                                        placeholder=''
                                                        as={TextField}
                                                        variant='outlined'
                                                        type='text'
                                                        fullWidth
                                                        // size="small"
                                                        margin="none"
                                                        multiline
                                                        rows={2}
                                                        className="bg-white"
                                                        // required
                                                        // error={Boolean(touched.question[idx] && errors.question[idx])}
                                                        // helperText={touched.question[idx] && errors.question[idx]}
                                                      />
                                                    </div> : null
                                                  }
                                                  {values.response[idx].responseType === "file" ?
                                                    <div>
                                                      <Field
                                                        id={`response[${idx}].responseContent`}
                                                        name={`response[${idx}].responseContent`}
                                                        component={ImgInput}
                                                        title='Upload File'
                                                        value={values.response[idx].responseContent}
                                                        onChange={(e) => {
                                                          e.preventDefault()
                                                          const reader = new FileReader()
                                                          const file = e.target.files[0]
                                                      
                                                          console.log(file)
                                                          if (file) {
                                                            if (IMG_SUPPORTED_FORMATES.includes(file.type)) {
                                                              // reader.onloadend = () => dispatch(setIsBackdropLoading(false))
                                                              reader.readAsDataURL(file)
                                                              reader.onload = () => {
                                                                console.log(reader.result)
                                                                setFieldValue(`response[${idx}].responseContent`, e.currentTarget.files[0]);
                                                                // setBlobImg(reader.result)
                                                              }
                                                            }
                                                            // props.setFieldValue(field.name, file)
                                                          }
                                                        }}                                    
                                                        // disabled={appState.isLoading}
                                                        // error={Boolean(errors.attachment)}
                                                        // helperText={touched.attachment && errors.attachment}
                                                      />
                                                    </div> : null
                                                  }
                                                  {values.response[idx].responseType === "button" ?
                                                    <div>
                                                      <Button variant='outlined' className='!rounded-full' onClick={handleClick} ><AddOutlinedIcon /></Button>
                                                      <Menu
                                                        anchorEl={anchorEl}
                                                        id="account-menu"
                                                        open={open}
                                                        onClose={handleClose}
                                                        onClick={() => {
                                                          handleClose()
                                                        }}
                                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                                      >
                                                        <div>
                                                          <div className='text-sm font-semibold pb-1 px-4'>
                                                            ADD Button
                                                          </div>
                                                          <Divider />
                                                          {RESPONSE_BUTTONS.map((btn, idx) =>
                                                            <div
                                                              key={idx}
                                                              className="hover:bg-slate-50 cursor-pointer"
                                                              onClick={() => {
                                                                replace(idx, {
                                                                  responseType: 'button',
                                                                  responseContent: btn.subTitle
                                                                })
                                                              }}
                                                            >
                                                              <div className="p-2 px-4">
                                                                <div className='text-sm font-medium'>{btn.title}</div>
                                                                <div className='text-xs font-normal'>{btn.subTitle}</div>
                                                              </div>
                                                              {idx !== RESPONSE_BUTTONS.length - 1 && <Divider />}
                                                            </div>
                                                          )}
                                                        </div>
                                                      </Menu>
                                                    </div> : null
                                                  }
                                                  <ErrorMessage
                                                    name={`response.${idx}.responseType`}
                                                    component="div"
                                                    className="field-error"
                                                  />
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </>
                                      ) : null}
                                      <div className='flex gap-2 my-3'>
                                        <Button
                                          variant='outlined'
                                          type="button"
                                          startIcon={<AddOutlinedIcon fontSize='small' />}
                                          className="!capitalize"
                                          onClick={() => push({
                                            responseType: 'text',
                                            responseContent: ''
                                          })}
                                        >
                                          Text
                                        </Button>
                                        <Button
                                          variant='outlined'
                                          type="button"
                                          startIcon={<AddOutlinedIcon fontSize='small' />}
                                          className="!capitalize"
                                          onClick={() => push({
                                            responseType: 'button',
                                            responseContent: ''
                                          })}
                                        >
                                          Buttons
                                        </Button>
                                        <Button
                                          variant='outlined'
                                          type="button"
                                          startIcon={<AddOutlinedIcon fontSize='small' />}
                                          className="!capitalize"
                                          onClick={() => push({
                                            responseType: 'file',
                                            responseContent: ''
                                          })}
                                        >
                                          Files / Media
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                />
                              </div>
                            </div>
                          </div>

                          <div className='flex gap-4 justify-center my-6'>
                            <Button variant='outlined' type="reset" onClick={handleOnReset} className="!capitalize">Cancel</Button>
                            <Button variant="contained" type="submit" className="!capitalize">Save</Button>
                          </div>
                        </div>
                      </div>
                    </Form>
                  )
                }}
              </Formik>
            </div>
            <div className='w-1/5 my-4'>
              <div className='rounded-lg border-slate-300 shadow-md sticky' style={{ top: 72 }}>
                <div className='bg-[#256cdc] p-4 flex items-center gap-3 rounded-t-xl '>
                  <Avatar>
                    <SmartToyOutlinedIcon />
                  </Avatar>
                  <span className='font-semibold text-white'>
                    QNA
                  </span>
                </div>
                <div className='bg-white p-4 relative'>
                  <div style={{ minHeight: 200 }}>
                    {qna.map((msg, idx) => (
                      <div key={idx} className={`mb-3 ${msg.type === 'userMsg' ? 'text-right' : ''}`}>
                        <div className={`w-5/6 text-sm px-2 py-1 rounded-lg ${msg.type === 'userMsg' ? 'bg-[#256cdc] text-white rounded-br-none ml-auto' : 'bg-gray-200 rounded-bl-none'}`}>
                          {msg.title}
                        </div>
                        <div className='text-[10px] my-1'>{msg.type === 'userMsg' ? 'Guest User ask' : 'CSD bot reply' }</div>
                      </div>
                    ))}
                  </div>
                  <hr className='border-dashed border-slate-600 my-2' />
                  <div className='py-2 pb-4 mx-2 text-center text-xs font-semibold'>
                    <div>Note: You can only see preview here. to test your bot,</div>
                    <div>Please click the button below</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
    </ThemeProvider>
  );
}

export default App;
