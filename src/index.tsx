import * as React from "react";
import * as yup from "yup";

export type Errors<T> = {[P in keyof T]?: string};

export interface RenderParams<T> {
    prevValues: T;
    values: T;
    errors: Errors<T>;
    setValue<P extends keyof T>(key: P, value: T[P]): void;
    handleValue<P extends keyof T>(key: P): (value: T[P]) => void;
    validate: () => boolean;
    submitting: boolean;
    setSubmitting: (submitting: boolean) => void;
}

export interface VvalState<T> {
    prevValues: T;
    values: T;
    errors: Errors<T>;
    submitting: boolean;
}

export interface VvalProps<T> {
    initialValues: T;
    schema?: yup.Schema<T>;
    render: (params: RenderParams<T>) => JSX.Element|JSX.Element[]|string|null;
    immediate?: boolean;
}

export default class Vval<T> extends React.Component<VvalProps<T>, VvalState<T>> {
    constructor(props: VvalProps<T>) {
        super(props);
        this.state = {
            prevValues: this.props.initialValues,
            values: this.props.initialValues,
            errors: {},
            submitting: false
        };
    }
    render() {
        return this.props.render({
            prevValues: this.state.prevValues,
            values: this.state.values,
            errors: this.state.errors,
            submitting: this.state.submitting,
            setValue: this.setValue.bind(this),
            handleValue: this.handleValue.bind(this),
            validate: this.validate.bind(this),
            setSubmitting: this.setSubmitting.bind(this)
        });
    }
    private validate(): boolean {
        if (!this.props.schema) {
            return true;
        }
        try {
            this.props.schema.validateSync(this.state.values, {abortEarly: false})
            this.setState({errors: {}});
        } catch (error) {
            const errors = this.handleError(error);
            this.setState({errors});
            return false;
        }
        return true;
    }
    private setValue<P extends keyof T>(key: P, value: T[P]): void {
        const values = this.state.values;
        const prevValues = Object.assign({}, values);
        values[key] = value;
        this.setState({prevValues, values});
        if (!this.props.schema) {
            return;
        }
        if (!this.props.immediate) {
            return;
        }
        try {
            this.props.schema.validateSync(this.state.values, {abortEarly: false})
            this.setState({errors: {}});
        } catch (error) {
            const errors = this.handleError(error);
            this.setState({errors});
        }
    }
    private setSubmitting(submitting: boolean): void {
        this.setState({submitting});
    }
    private handleValue<P extends keyof T>(key: P): (value: T[P]) => void {
        return (value: T[P]) => {
            this.setValue(key, value);
        };
    }
    private handleError(error: yup.ValidationError): Errors<T> {
        const errors = {} as Errors<T>;
        error.inner.forEach(err => {
            const path = err.path as keyof T;
            if (path && !errors[path]) {
                errors[path] = err.message;
            }
        });
        return errors;
    }
}
