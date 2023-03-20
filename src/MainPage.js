import * as React from 'react';
import {
    Avatar,
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    MenuItem,
    TextField,
    Menu,
    Divider,
} from '@mui/material'
import { Field, Form, Formik, FieldArray, ErrorMessage } from 'formik';
import Select from '@mui/material/Select';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import isEmpty from 'lodash/isEmpty'
import * as Yup from "yup";
import axios from 'axios'
import Swal from 'sweetalert2'
import { GA4React } from "ga-4-react";
import { useLocation } from 'react-router-dom';

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

const FILE_SIZE = 2097152 //2 mb

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

const ga4react = new GA4React(process.env.GA_ID).initialize()

export default function () {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [qna, setQna] = React.useState([])
    const open = Boolean(anchorEl);
    const {pathname, search} = useLocation()

    const analytics = React.useCallback(() => {
      trackPathForAnalytics({
        path: pathname,
        search: search,
        title: pathname.split("/")[1] 
      })
    })
  
    const trackPathForAnalytics = (data) => {
      const {path, search, title} = data
      ga4react.then((ga) => {
        ga.pageview(path, search, title)
    }).catch((err) => console.error("Analytics failed >>>", err))
    }
    
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
      responseType: 'text',
      responseContent: 'hello'
    }
  
    const validationSchema = Yup.object().shape({
        title: Yup.string().trim().required("This field is required"),
        topics: Yup.array().of(
          Yup.string().trim()
        ),
        question: Yup.array().of(
          Yup.string().required("Please enter question synonym")
        ).min(3, 'Minimum 5 question required'),
        responseType: Yup.string(),
        responseContent: Yup.string().trim().required('Please enter reponse ')
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
                                      "text": formData.responseContent,
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
  
      await axiosInstance.post(url, req).then((res) => {
        console.log(res)
        if(res.status === 200){
          console.log("qna", qna)
          const newQna = [
            ...qna,
            formData
          ]
          console.log("newQna", newQna)
          setQna(newQna)
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

    React.useEffect(() => {
        analytics()
      }, [analytics])

    return (
        <>
        <header className='sticky top-0 w-full bg-neutral-100 shadow-md z-40 backdrop-blur'>
            {/* <div className='bg-[#E7F4E4] text-center'>434 record Updated/72 record Delted <span>Publish Now</span></div> */}
            <nav className='relative mx-auto h-14 flex items-center justify-center overflow-hidden'>
              <div className='text-lg text-center'>Add Q&A</div>
            </nav>
          </header>

          <main>
            <div className='grid md:flex grid-cols-1 md:grid-cols-2 md:gap-4 mx-4'>
              <div className='md:w-4/5'>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleOnSubmit}
                >
                  {({ values, errors, touched, setFieldValue }) => {
                    return (
                      <Form noValidate>
                        <div className='my-4 grid grid-cols-1 md:grid-cols-2 md:gap-4 '>
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
                            <div className='grid grid-cols-1 md:grid-cols-2 m-4 gap-4'>
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
                                  <div className='bg-[#d1e4fe] pt-2 pb-4 px-4 rounded-md my-3'>
                                    <div className='my-1'>
                                      <div className='font-semibold'>{values.responseType === "text" && 'Bots Message'}</div>
                                      {/* {idx > 0 &&
                                      <IconButton onClick={() => remove(idx)} color="default" size="small">
                                        <DeleteIcon fontSize='small' />
                                      </IconButton>
                                      } */}
                                    </div>
                                    {values.responseType === "button" ?
                                      <div>
                                        <Button variant='outlined' className='!rounded-full !capitalize' onClick={handleClick}><AddOutlinedIcon fontSize='small' /> {values.responseContent}</Button>
                                        <Menu
                                          anchorEl={anchorEl}
                                          id="account-menu"
                                          open={open}
                                          onClose={handleClose}
                                          onClick={handleClose}
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
                                                onClick={() => setFieldValue('responseContent', btn.subTitle)}                                              
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
                                    {values.responseType === "text" || values.responseType === "button" ?
                                      <Field
                                        name={`responseContent`}
                                        placeholder=''
                                        as={TextField}
                                        variant='outlined'
                                        type='text'
                                        fullWidth
                                        // size="small"
                                        margin="none"
                                        multiline
                                        rows={2}
                                        className={`bg-white`}
                                        sx={{ display: values.responseType === "button" ? 'none' : 'block' }}
                                        // required
                                        error={Boolean(touched.responseContent && errors.responseContent)}
                                      />: null
                                    }
                                    {values.responseType === "file" ?
                                      <div>
                                        <Field
                                          id={`responseContent`}
                                          name={`responseContent`}
                                          component={ImgInput}
                                          title='Upload File'
                                          // value={values.responseContent}
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
                                                  setFieldValue(`responseContent`, e.currentTarget.files[0]);
                                                  // setBlobImg(reader.result)
                                                }
                                              }
                                              // props.setFieldValue(field.name, file)
                                            }
                                          }}                                    
                                          // disabled={appState.isLoading}
                                          error={Boolean(errors.responseContent)}
                                        />
                                      </div> : null
                                    }
                                    {touched.responseContent && errors.responseContent ?
                                      <div className='text-red-500 text-sm mt-2'>
                                        <ErrorMessage name="responseContent" /> {values.responseType === 'text' ? 'message' : values.responseType}
                                      </div> : null}
                                  </div>
                                  <div className='flex gap-2 my-3'>
                                    <Button
                                      variant='outlined'
                                      type="button"
                                      startIcon={<AddOutlinedIcon fontSize='small' />}
                                      className="!capitalize"
                                      onClick={() => {
                                        setFieldValue('responseType', 'text')
                                        setFieldValue('responseContent', '')
                                      }}
                                    >
                                      Text
                                    </Button>
                                    <Button
                                      variant='outlined'
                                      type="button"
                                      startIcon={<AddOutlinedIcon fontSize='small' />}
                                      className="!capitalize"
                                      onClick={() => {
                                        setFieldValue('responseType', 'button')
                                        setFieldValue('responseContent', '')
                                      }}
                                    >
                                      Buttons
                                    </Button>
                                    <Button
                                      variant='outlined'
                                      type="button"
                                      startIcon={<AddOutlinedIcon fontSize='small' />}
                                      className="!capitalize"
                                      onClick={() => {
                                        setFieldValue('responseType', 'file')
                                        setFieldValue('responseContent', '')
                                      }}
                                    >
                                      Files / Media
                                    </Button>
                                  </div>
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
              <div className='md:w-1/5 my-4'>
                <div className='rounded-lg border-slate-300 shadow-md md:sticky md:top-[72px]'>
                  <div className='bg-[#256cdc] p-4 flex items-center gap-3 rounded-t-xl '>
                    <Avatar>
                      <SmartToyOutlinedIcon />
                    </Avatar>
                    <span className='font-semibold text-white'>
                      QNA
                    </span>
                  </div>
                  <div className='bg-white relative'>
                    <div style={{ height: 220, overflowY: "scroll", overflowX: "hidden" }} className="p-4">
                      {isEmpty(qna) ? <div className='text-sm text-center'>Please Add Q&N</div> :
                        qna.map((msg, idx) => (
                          <div key={idx}>
                            <div className='mb-3'>
                              <div className={`w-5/6 text-sm px-3 py-1 rounded-lg bg-[#256cdc] text-white rounded-br-none ml-auto`}>
                                {msg.title}
                              </div>
                              <div className='text-[10px] my-1 text-right'>Guest User ask</div>
                            </div>

                            <div className={`mb-3`}>
                              <div className={`w-5/6 text-sm px-3 py-1 rounded-lg bg-gray-200 rounded-bl-none`}>
                                {['text', 'button'].includes(msg.responseType) ? msg.responseContent : <img src={msg.responseContent} />}
                              </div>
                              <div className='text-[10px] my-1'>CSD bot reply</div>
                            </div>
                          </div>
                        ))
                      }
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
        </>
    )
}