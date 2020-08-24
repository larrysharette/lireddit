import { Box, Button } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import TextAreaField from "../components/TextAreaField";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useAuth } from "../utils/hooks/useAuth";

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = () => {
  const [, createPost] = useCreatePostMutation();
  const router = useRouter();
  useAuth();

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          const { error } = await createPost({ input: values });
          if (!error) {
            router.push("/");
          }
        }}
      >
        {({ values, isSubmitting, handleChange }) => (
          <Form>
            <InputField name="title" label="Post Title" placeholder="Title" value={values.title} onChange={handleChange} />
            <Box mt={4}>
              <TextAreaField name="text" label="Body" type="Text" placeholder="Text..." value={values.text} onChange={handleChange} />
            </Box>
            <Button mt={4} variantColor="teal" isLoading={isSubmitting} type="submit">
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
