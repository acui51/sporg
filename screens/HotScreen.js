import { Divider, Layout, Text } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { supabase } from "../supabase";

const HotScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHotPosts = async () => {
    console.log("fetchHotPosts");
    setLoading(true);
    const { data, error } = await supabase.from("posts").select();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHotPosts();
  }, []);

  useEffect(() => {
    const CHANNEL = supabase.channel("table-db-changes").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "posts",
      },
      () => {
        fetchHotPosts();
      }
    );

    CHANNEL.subscribe();

    return () => {
      CHANNEL.unsubscribe();
    };
  }, [fetchHotPosts]);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <Layout style={{ flex: 1 }}>
      {posts.map((post) => {
        return (
          <View style={{ padding: 16 }} key={post.id}>
            <Text category="h3">{post.title}</Text>
            <Text>{post.description}</Text>
            <Text>{post.created_at}</Text>
            <Divider />
          </View>
        );
      })}
    </Layout>
  );
};

export default HotScreen;
