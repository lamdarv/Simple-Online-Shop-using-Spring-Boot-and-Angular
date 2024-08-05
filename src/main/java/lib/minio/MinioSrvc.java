package lib.minio;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.minio.*;
import io.minio.errors.*;
import io.minio.http.Method;
import io.minio.messages.Item;
import jakarta.servlet.http.HttpServletResponse;
import lib.i18n.utility.MessageUtil;
import lib.minio.configuration.property.MinioProp;
import lib.minio.exception.MinioServiceDownloadException;
import lib.minio.exception.MinioServiceUploadException;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class MinioSrvc {

  private static final Long DEFAULT_EXPIRY = TimeUnit.HOURS.toSeconds(1);

  private final MinioClient minio;
  private final MinioProp prop;

  private final MessageUtil message;

  private static String bMsg(String bucket) {
    return "bucket " + bucket;
  }

  private static String bfMsg(String bucket, String filename) {
    return bMsg(bucket) + " of file " + filename;
  }

  public String getLink(String bucket, String filename, Long expiry) {
    try {
      return minio.getPresignedObjectUrl(
          GetPresignedObjectUrlArgs.builder()
              .method(Method.GET)
              .bucket(bucket)
              .object(filename)
              .expiry(Math.toIntExact(expiry), TimeUnit.SECONDS)
              .build());
    } catch (InvalidKeyException | ErrorResponseException | InsufficientDataException | InternalException
        | InvalidResponseException | NoSuchAlgorithmException | XmlParserException | ServerException
        | IllegalArgumentException | IOException e) {
      log.error(message.get(prop.getGetErrorMessage(), bfMsg(bucket, filename)) + ": " + e.getLocalizedMessage(), e);
      throw new MinioServiceDownloadException(
          message.get(prop.getGetErrorMessage(), bfMsg(bucket, filename)), e);
    }
  }

  @Data
  public static class ListItem {
    private String objectName;
    private Long size;
    private boolean dir;
    private String versionId;

    @JsonIgnore
    private Item item;

    public ListItem(Item item) {
      this.objectName = item.objectName();
      this.size = item.size();
      this.dir = item.isDir();
      this.versionId = item.versionId();
      this.item = item;
    }
  }

  public List<Object> getList(String bucket) {
    List<Result<Item>> results = new ArrayList<>();
    minio.listObjects(
        ListObjectsArgs.builder()
            .bucket(bucket)
            .recursive(true)
            .build())
        .forEach(results::add);
    return results.stream().map(t -> {
      try {
        return new ListItem(t.get());
      } catch (InvalidKeyException | ErrorResponseException | IllegalArgumentException | InsufficientDataException
          | InternalException | InvalidResponseException | NoSuchAlgorithmException | ServerException
          | XmlParserException | IOException e) {
        log.error(message.get(prop.getGetErrorMessage(), bMsg(bucket)) + ": " + e.getLocalizedMessage(), e);
        return null;
      }
    }).collect(Collectors.toList());
  }

  public void view(HttpServletResponse response, String bucket, String filename, Long expiry) {
    try {
      response.sendRedirect(this.getLink(bucket, filename, expiry));
    } catch (IOException e) {
      log.error(message.get(prop.getGetErrorMessage(), bfMsg(bucket, filename)) + ": " + e.getLocalizedMessage(), e);
      throw new MinioServiceDownloadException(
          message.get(prop.getGetErrorMessage(), bfMsg(bucket, filename)), e);
    }
  }

  public void view(HttpServletResponse response, String bucket, String filename) {
    this.view(response, bucket, filename, DEFAULT_EXPIRY);
  }

  @Data
  @Builder
  public static class UploadOption {
    private String filename;
  }

  public ObjectWriteResponse upload(MultipartFile file, String bucket, Function<MultipartFile, UploadOption> modifier) {
    UploadOption opt = modifier.apply(file);
    try {
      return minio.putObject(
          PutObjectArgs.builder()
              .bucket(bucket)
              .object(opt.filename)
              .stream(file.getInputStream(), file.getSize(), -1)
              .contentType(file.getContentType())
              .build());
    } catch (InvalidKeyException | ErrorResponseException | InsufficientDataException | InternalException
        | InvalidResponseException | NoSuchAlgorithmException | ServerException | XmlParserException
        | IllegalArgumentException | IOException e) {
      log.error(message.get(prop.getPostErrorMessage(), bfMsg(bucket, opt.filename)) + ": " + e.getLocalizedMessage(),
          e);
      throw new MinioServiceUploadException(
          message.get(prop.getPostErrorMessage(), bucket, opt.filename), e);
    }
  }

  public ObjectWriteResponse upload(MultipartFile file, String bucket) {
    return this.upload(file, bucket,
        o -> UploadOption.builder()
            .filename(System.currentTimeMillis() + "_-_"
                + o.getOriginalFilename().replace(" ", "_"))
            .build());
  }

  // ---

  public ObjectWriteResponse upload(InputStream file, String filename, String bucket) {
    try {
      return minio.putObject(
          PutObjectArgs.builder()
              .bucket(bucket)
              .object(filename)
              .stream(file, file.available(), -1)
              .build());
    } catch (InvalidKeyException | ErrorResponseException | InsufficientDataException | InternalException
        | InvalidResponseException | NoSuchAlgorithmException | ServerException | XmlParserException
        | IllegalArgumentException | IOException e) {
      log.error(message.get(prop.getPostErrorMessage(), bfMsg(bucket, filename)) + ": " + e.getLocalizedMessage(),
          e);
      throw new MinioServiceUploadException(
          message.get(prop.getPostErrorMessage(), bucket, filename), e);
    }
  }

  public InputStream read(String filename, String bucket) throws InvalidKeyException, ErrorResponseException,
      InsufficientDataException, InternalException, InvalidResponseException, NoSuchAlgorithmException, ServerException,
      XmlParserException, IllegalArgumentException, IOException {
    return minio.getObject(GetObjectArgs.builder()
        .bucket(bucket)
        .object(filename)
        .build());
  }

}
