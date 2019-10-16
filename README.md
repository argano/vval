# valid-form

Store and validate values for React

## Install

```
$ npm install valid-form yup
```

## Usage

```
import ValidFrom from "valid-form";
import * as yup from "yup";

<ValidForm
  schema={yup.object().shape({
    email: yup
      .string()
      .email()
      .required(),
    password: yup
      .string()
      .min(8)
     .required()
  })}
  initialValues={{
    email: "",
    password: ""
  }}
  render={({ values, handleValue, validate }) => (
    <>
      <EmailInput value={values.email} onChange={handleValue} />
      <PasswordInput value={values.password} onChange={handleValue} />
    </>
  )
/>
```

## Contribution

1. Fork it ( http://github.com/argano/valid-form )
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create new Pull Request

## License

MIT
