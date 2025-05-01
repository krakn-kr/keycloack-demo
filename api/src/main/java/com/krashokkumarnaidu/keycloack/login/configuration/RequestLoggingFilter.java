package com.krashokkumarnaidu.keycloack.login.configuration;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

//@Component
public class RequestLoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        String method = httpRequest.getMethod();
        String uri = httpRequest.getRequestURI();
        String queryString = httpRequest.getQueryString() != null ? "?" + httpRequest.getQueryString() : "";
        String remoteAddr = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");

        // Log request details
        System.out.println(String.format("[%s] REQUEST: %s %s%s from %s (User-Agent: %s)",
                timestamp, method, uri, queryString, remoteAddr, userAgent));

        long startTime = System.currentTimeMillis();

        // Continue with the request
        chain.doFilter(request, response);

        // Log response details
        long duration = System.currentTimeMillis() - startTime;
        int status = httpResponse.getStatus();
        System.out.println(String.format("[%s] RESPONSE: %s %s%s - %d (%dms)",
                timestamp, method, uri, queryString, status, duration));
    }
}